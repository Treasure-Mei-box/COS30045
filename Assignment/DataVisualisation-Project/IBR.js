// Constants for visualization
const width = 1200;
const height = 700;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Debug logging
    console.log('DOM loaded, initializing visualization...');

    // Select SVG and create tooltip
    const svg = d3.select("#BR");
    const tooltip = d3.select(".BRtooltip");

    // Debug check if elements exist
    if (!svg.node()) {
        console.error('SVG element not found');
        return;
    }

    // Set SVG dimensions explicitly
    svg.attr('width', width)
        .attr('height', height);

    // UI Controls
    const yearSlider = document.getElementById("yearSlider");
    const yearDisplay = document.getElementById("yearDisplay");
    const playButton = document.getElementById("playButton");

    // Color scale
    const color = d3.scaleSequential(d3.interpolateYlOrRd)
        .domain([0, 30]);

    // Map projection
    const projection = d3.geoMercator()
        .center([115, 10])
        .scale(1000)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load data with error handling
    Promise.all([
        d3.json("asia.geojson").catch(error => {
            console.error('Error loading GeoJSON:', error);
            throw new Error('Failed to load map data');
        }),
        d3.csv("IBR.csv").catch(error => {
            console.error('Error loading CSV:', error);
            throw new Error('Failed to load birth rate data');
        })
    ]).then(([worldData, birthData]) => {
        console.log('Data loaded successfully');
        console.log('World data features:', worldData?.features?.length);
        console.log('Birth data rows:', birthData?.length);

        // Process birth rate data
        const birthRates = {};
        birthData.forEach(d => {
            const countryCode = d['Country Code'];
            if (!birthRates[countryCode]) {
                birthRates[countryCode] = {};
            }
            birthRates[countryCode][d.Year] = +d['Birth Rate'];
        });


        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Create main group for map
        const g = svg.append("g");
        console.log('Map group created');

        // Update map function with error handling
        function updateMap(year) {
            try {
                console.log(`Updating map for year: ${year}`);

                const countries = g.selectAll(".country")
                    .data(worldData.features);

                // Enter + Update
                countries.join("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .attr("fill", d => {
                        const rate = birthRates[d.id]?.[year];
                        return rate ? color(rate) : "#ccc";
                    })
                    .on("mouseover", (event, d) => {
                        const rate = birthRates[d.id]?.[year];
                        const [centroidX, centroidY] = path.centroid(d); // Calculate the centroid of the country

                        tooltip
                            .style("opacity", 1)
                            .html(`
                                <strong>${d.properties.name}</strong><br/>
                                Birth Rate: ${rate ? rate.toFixed(1) : "No data"} per 1,000 people<br/>
                                Year: ${year}
                            `)
                            .style("left", (centroidX + 10) + "px")
                            .style("top", (centroidY - 10) + "px");
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                    })

                    .on("click", (event, d) => {
                        const rate = birthRates[d.id]?.[year];
                        // Zoom to the clicked country
                        const centroid = path.centroid(d);
                        const bounds = path.bounds(d); // Get the bounding box of the country

                        const dx = bounds[1][0] - bounds[0][0]; // Calculate width of the bounding box
                        const dy = bounds[1][1] - bounds[0][1]; // Calculate height of the bounding box
                        const x = (bounds[0][0] + bounds[1][0]) / 2; // Center the bounding box horizontally
                        const y = (bounds[0][1] + bounds[1][1]) / 2; // Center the bounding box vertically
                        const scale = 0.9 / Math.max(dx / width, dy / height); // Adjust the zoom level based on the size of the country

                        // Apply the zoom effect using D3's zoom behavior
                        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(width / 2 - x * scale, height / 2 - y * scale).scale(scale));
                    });

                console.log('Map updated successfully');
            } catch (error) {
                console.error('Error updating map:', error);
            }
        }

        // Initialize map
        updateMap(2023);
        console.log('Initial map rendered');

        // Event listeners
        if (yearSlider) {
            yearSlider.addEventListener("input", (event) => {
                const selectedYear = parseInt(event.target.value);
                if (yearDisplay) yearDisplay.textContent = selectedYear;
                updateMap(selectedYear);

                // Update slider appearance dynamically
                updateSliderAppearance(selectedYear);
            });
        }

        // Function to update slider appearance based on the current year
        function updateSliderAppearance(year) {
            // For example, change the color of the thumb based on the selected year
            const thumb = yearSlider.querySelector('::-webkit-slider-thumb');

            if (year <= 2000) {
                yearSlider.style.setProperty('--thumb-color', '#1E2A5E'); // Blue color for early years
            } else if (year <= 2010) {
                yearSlider.style.setProperty('--thumb-color', '#FF6F61'); // Red color for medium years
            } else {
                yearSlider.style.setProperty('--thumb-color', '#4CAF50'); // Green color for recent years
            }
        }

        // CSS in JS for dynamic styling (set thumb color dynamically)
        const sliderStyles = `
    #yearSlider::-webkit-slider-thumb {
        background: var(--thumb-color, #1E2A5E); /* Default to blue if no custom color set */
    }
    #yearSlider::-moz-range-thumb {
        background: var(--thumb-color, #1E2A5E); /* Default to blue if no custom color set */
    }
`;

        // Inject CSS styles dynamically into the document
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = sliderStyles;
        document.head.appendChild(styleSheet);

        // Animation controls
        let isPlaying = false;
        let animationInterval;

        if (playButton) {
            playButton.addEventListener("click", () => {
                isPlaying = !isPlaying;
                playButton.textContent = isPlaying ? "Pause Animation" : "Play Animation";

                if (isPlaying) {
                    let currentYear = parseInt(yearSlider.value);
                    animationInterval = setInterval(() => {
                        currentYear = currentYear >= 2023 ? 1990 : currentYear + 1;
                        yearSlider.value = currentYear;
                        if (yearDisplay) yearDisplay.textContent = currentYear;
                        updateMap(currentYear);
                    }, 200);
                } else {
                    clearInterval(animationInterval);
                }
            });
        }

    }).catch(error => {
        console.error('Failed to initialize visualization:', error);
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.textContent = 'Failed to load visualization. Please check the console for details.';
        document.querySelector('.map-container').appendChild(errorContainer);
    });
});
