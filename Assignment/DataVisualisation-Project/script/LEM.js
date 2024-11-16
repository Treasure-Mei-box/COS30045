const data = [
  {
    country: "Brunei",
    years: [
      { year: 2013, ages: [77.7] },
      { year: 2014, ages: [75.8] },
      { year: 2015, ages: [77.8] },
      { year: 2016, ages: [76.9] },
      { year: 2017, ages: [76.4] },
      { year: 2018, ages: [77.5] },
      { year: 2019, ages: [76.6] },
      { year: 2020, ages: [77.1] },
      { year: 2021, ages: [76.3] },
      { year: 2022, ages: [74.5] },
    ]
  },
  {
    country: "Cambodia",
    years: [
      { year: 2013, ages: [64.8] },
      { year: 2014, ages: [65.6] },
      { year: 2015, ages: [66.4] },
      { year: 2016, ages: [67.1] },
      { year: 2017, ages: [67.9] },
      { year: 2018, ages: [68.6] },
      { year: 2019, ages: [74.2] },
      { year: 2020, ages: [69.9] },
      { year: 2021, ages: [70.6] },
      { year: 2022, ages: [71.2] }
    ]
  },
  // Add similar data for 9 more countries
  {
    country: "Indonesia",
    years: [
      { year: 2013, ages: [68.5] },
      { year: 2014, ages: [68.9] },
      { year: 2015, ages: [68.9] },
      { year: 2016, ages: [68.1] },
      { year: 2017, ages: [69.2] },
      { year: 2018, ages: [69.3] },
      { year: 2019, ages: [69.4] },
      { year: 2020, ages: [69.6] },
      { year: 2021, ages: [69.7] },
      { year: 2022, ages: [69.9] }
    ]
  },
  {
    country: "Lao",
    years: [
      { year: 2013, ages: [65] },
      { year: 2014, ages: [66] },
      { year: 2015, ages: [65] },
      { year: 2016, ages: [63] },
      { year: 2017, ages: [65] },
      { year: 2018, ages: [64] },
      { year: 2019, ages: [65] },
      { year: 2020, ages: [65] },
      { year: 2021, ages: [65] },
      { year: 2022, ages: [66] }
    ]
  },
  {
    country: "Malaysia",
    years: [
      { year: 2013, ages: [72.3] },
      { year: 2014, ages: [72.4] },
      { year: 2015, ages: [72.5] },
      { year: 2016, ages: [72.1] },
      { year: 2017, ages: [72.1] },
      { year: 2018, ages: [72.3] },
      { year: 2019, ages: [72.5] },
      { year: 2020, ages: [72.5] },
      { year: 2021, ages: [72.3] },
      { year: 2022, ages: [71.3] }
    ]
  },
  {
    country: "Myanmar",
    years: [
      { year: 2013, ages: [65.5] },
      { year: 2014, ages: [59.3] },
      { year: 2015, ages: [59.7] },
      { year: 2016, ages: [60.3] },
      { year: 2017, ages: [60.8] },
      { year: 2018, ages: [61.3] },
      { year: 2019, ages: [62] },
      { year: 2020, ages: [62] },
      { year: 2021, ages: [62.7] },
      { year: 2022, ages: [62.7] }
    ]
  },
  {
    country: "Phillipines",
    years: [
      { year: 2013, ages: [] },
      { year: 2014, ages: [] },
      { year: 2015, ages: [69.6] },
      { year: 2016, ages: [] },
      { year: 2017, ages: [] },
      { year: 2018, ages: [] },
      { year: 2019, ages: [] },
      { year: 2020, ages: [71.3] },
      { year: 2021, ages: [71.3] },
      { year: 2022, ages: [71.3] }
    ]
  },
  {
    country: "Singapore",
    years: [
      { year: 2013, ages: [80.1] },
      { year: 2014, ages: [80.3] },
      { year: 2015, ages: [80.5] },
      { year: 2016, ages: [80.7] },
      { year: 2017, ages: [80.9] },
      { year: 2018, ages: [81.2] },
      { year: 2019, ages: [81.4] },
      { year: 2020, ages: [81.3] },
      { year: 2021, ages: [80.8] },
      { year: 2022, ages: [80.7] }
    ]
  },
  {
    country: "Thailand",
    years: [
      { year: 2013, ages: [] },
      { year: 2014, ages: [] },
      { year: 2015, ages: [] },
      { year: 2016, ages: [71.2] },
      { year: 2017, ages: [71.8] },
      { year: 2018, ages: [72] },
      { year: 2019, ages: [71.9] },
      { year: 2020, ages: [72.4] },
      { year: 2021, ages: [73.5] },
      { year: 2022, ages: [73.6] }
    ]
  },
  {
    country: "Vietnam",
    years: [
      { year: 2013, ages: [70.5] },
      { year: 2014, ages: [70.6] },
      { year: 2015, ages: [70.7] },
      { year: 2016, ages: [70.8] },
      { year: 2017, ages: [70.9] },
      { year: 2018, ages: [70.9] },
      { year: 2019, ages: [71] },
      { year: 2020, ages: [71] },
      { year: 2021, ages: [71.1] },
      { year: 2022, ages: [71.1] }
    ]
  }
];


class RadialChart {
  constructor(containerId, data, width = 700, height = 600) {
    this.svg = document.getElementById(containerId);
    this.data = data;
    this.width = width;
    this.height = height;
    this.centerX = 500;
    this.centerY = height / 2;
    this.innerRadius = 120;
    this.outerRadius = Math.min(width, height) / 2 - 60;
    this.segmentAngle = (2 * Math.PI) / data.length;
    this.yearRadius = (this.outerRadius - this.innerRadius) / 10; // 10 years
    this.tooltip = document.querySelector('.LEMtooltip');
    this.init();
  }

  getColor(value) {
    if (!value) return '#eee';
    // Scale from red (70) to green (82)
    const minValue = 68;
    const maxValue = 85;
    const hue = ((value - minValue) / (maxValue - minValue)) * 120;
    return `hsl(${hue}, 70%, 50%)`;
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, outerRadius, endAngle);
    const end = this.polarToCartesian(x, y, outerRadius, startAngle);
    const innerStart = this.polarToCartesian(x, y, innerRadius, endAngle);
    const innerEnd = this.polarToCartesian(x, y, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "L", start.x, start.y
    ].join(" ");
  }

  createSegment(country, yearData, countryIndex, yearIndex) {
    if (yearData.ages.length === 0) return null;

    const value = yearData.ages[0];
    const startAngle = countryIndex * this.segmentAngle * 180 / Math.PI;
    const endAngle = (countryIndex + 1) * this.segmentAngle * 180 / Math.PI;
    const radius = this.innerRadius + yearIndex * this.yearRadius;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", this.describeArc(
      this.centerX,
      this.centerY,
      radius,
      radius + this.yearRadius - 2,
      startAngle,
      endAngle
    ));
    path.setAttribute("fill", this.getColor(value));
    path.setAttribute("opacity", "0.8");

    path.addEventListener('mouseover', (e) => {
      path.setAttribute("opacity", "1");
      this.tooltip.style.opacity = "1";
      this.tooltip.innerHTML = `
        <strong>${country}</strong><br>
        ${yearData.year}: ${value} years
      `;

      // Position the tooltip
      const tooltipRect = this.tooltip.getBoundingClientRect();
      const offsetX = e.pageX + 10 + tooltipRect.width > window.innerWidth
        ? -tooltipRect.width - 10
        : 10;
      const offsetY = e.pageY + 10 + tooltipRect.height > window.innerHeight
        ? -tooltipRect.height - 10
        : 10;

      this.tooltip.style.left = `${e.pageX + offsetX}px`;
      this.tooltip.style.top = `${e.pageY + offsetY}px`;
    });


    path.addEventListener('mousemove', (e) => {
      const tooltipRect = this.tooltip.getBoundingClientRect();
      const offsetX = e.pageX + 10 + tooltipRect.width > window.innerWidth
        ? -tooltipRect.width - 10
        : 10;
      const offsetY = e.pageY + 10 + tooltipRect.height > window.innerHeight
        ? -tooltipRect.height - 10
        : 10;

      this.tooltip.style.left = (e.pageX + offsetX) + 'px';
      this.tooltip.style.top = (e.pageY + offsetY) + 'px';
    });

    path.addEventListener('mouseout', () => {
      path.setAttribute("opacity", "0.8");
      this.tooltip.style.opacity = "0";
    });
    return path;
  }

  createLabel(country, index) {
    const angle = index * this.segmentAngle + this.segmentAngle / 2;
    const radius = this.outerRadius + 50;
    const x = this.centerX + radius * Math.cos(angle - Math.PI / 2);
    const y = this.centerY + radius * Math.sin(angle - Math.PI / 2);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-size", "13");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("fill", "#333");
    text.textContent = country;

    return text;
  }
  createLegend() {
    const legendDiv = document.getElementById('LEMLegend');
    const ranges = [
      { min: 78, max: 85, label: "Above 78 years", color: this.getColor(78) },
      { min: 74, max: 77, label: "74-77 years", color: this.getColor(75) },
      { min: 70, max: 73, label: "70-73 years", color: this.getColor(71) },
      { min: 65, max: 69, label: "65-69 years", color: this.getColor(67) },
      { min: 60, max: 64, label: "Under 60 years", color: this.getColor(60) }
    ];

    // Set styles for the legend container
    legendDiv.style.position = 'relative';
    legendDiv.style.display = 'inline-block';
    legendDiv.style.verticalAlign = 'bottom';
    legendDiv.style.backgroundColor = 'white';
    legendDiv.style.borderRadius = '8px';
    legendDiv.style.padding = '10px';
    legendDiv.style.width = '300px';

    // Iterate over the ranges and create legend items
    ranges.forEach(range => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.marginBottom = '8px';

      const colorBox = document.createElement('span');
      colorBox.className = 'legend-color';
      colorBox.style.width = '20px';
      colorBox.style.height = '20px';
      colorBox.style.borderRadius = '4px';
      colorBox.style.backgroundColor = range.color;
      colorBox.style.marginRight = '10px';

      const label = document.createElement('span');
      label.textContent = range.label;

      div.appendChild(colorBox);
      div.appendChild(label);
      legendDiv.appendChild(div);
    });
  }

  init() {
    // Clear existing SVG elements
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    // Create segments
    this.data.forEach((countryData, countryIndex) => {
      countryData.years.forEach((yearData, yearIndex) => {
        const segment = this.createSegment(
          countryData.country,
          yearData,
          countryIndex,
          yearIndex
        );
        if (segment) this.svg.appendChild(segment);
      });

      // Create country labels
      const label = this.createLabel(countryData.country, countryIndex);
      this.svg.appendChild(label);
    });

    // Add legend
    this.createLegend();
  }
}

// Instantiate the RadialChart
const chart = new RadialChart('LEM', data);
function closeIntro() {
  document.getElementById("intro-alert").style.display = "none";
}
