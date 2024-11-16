// Data structure
const data = {
  name: "",
  children: [
    {
      name: "Large Population",
      children: [
        { name: "Indonesia", value: 281190068, growth: 0.84 },
        { name: "Philippines", value: 114891200, growth: 0.81 }
      ]
    },
    {
      name: "Medium Population",
      children: [
        { name: "Vietnam", value: 100352189, growth: 0.67 },
        { name: "Thailand", value: 76538911, growth: 0.60 },
        { name: "Myanmar", value: 54133801, growth: 0.70 }
      ]
    },
    {
      name: "Developing",
      children: [
        { name: "Malaysia", value: 35126295, growth: 1.24 },
        { name: "Cambodia", value: 17423881, growth: 1.41 }
      ]
    },
    {
      name: "Small Population",
      children: [
        { name: "Laos", value: 7665002, growth: 1.40 },
        { name: "Singapore", value: 5789091, growth: 2.46 },
        { name: "Brunei", value: 458959, growth: 0.78 }
      ]
    }
  ]
};

// Insights for each region
const insights = {
  "Large Population": "Home to nearly 400M people, Indonesia and Philippines drive ASEAN's demographic weight",
  "Medium Population": "Vietnam, Thailand, and Myanmar form a substantial middle tier with stable growth",
  "Developing": "Malaysia and Cambodia show high growth potential with rates above 1.2%",
  "Small Population": "Despite smaller populations, Singapore leads in growth at 2.46%"
};

function initializeVisualization() {
  // Set up dimensions
  const container = document.getElementById('visualization');
  const width = container.clientWidth;
  const height = container.clientHeight;
  const padding = 3;

  // Create SVG
  const svg = d3.select('#visualization')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', '100%')
    .attr('height', '100%');

  // Enhanced color scale with more distinct colors
  const colorScale = d3.scaleLinear()
    .domain([0, 1, 2, 3])
    .range(['#2c6aa0', '#3d8bc2', '#4aa6e5', '#56a4e6'])
    .interpolate(d3.interpolateHcl);

  // Create pack layout with adjusted padding
  const pack = d3.pack()
    .size([width - padding * 2, height - padding * 2])
    .padding(padding);

  const root = d3.hierarchy(data)
    .sum(d => Math.max(0, d.value))
    .sort((a, b) => b.value - a.value);

  const nodes = pack(root);

  // Create gradient with enhanced opacity
  const gradient = svg.append('defs')
    .append('radialGradient')
    .attr('id', 'circle-gradient')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', '50%')
    .attr('fx', '50%')
    .attr('fy', '50%');

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#56a4e6')
    .attr('stop-opacity', 0.4);

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#2c6aa0')
    .attr('stop-opacity', 0.8);

  // Create tooltip with enhanced styling
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'POPtooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background', 'rgba(255, 255, 255, 0.9)')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
    .style('pointer-events', 'none');

  // Draw circles with improved interaction
  const node = svg.append('g')
    .selectAll('circle')
    .data(root.descendants())
    .join('circle')
    .attr('class', d => d.children ? 'node' : 'node node--leaf')
    .attr('fill', d => d.children ? 'url(#circle-gradient)' : colorScale(d.depth))
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => Math.max(0, d.r))  // Ensure the radius is never negative
    .style('cursor', 'pointer')
    .style('stroke', d => d.children ? 'none' : '#fff')
    .style('stroke-width', 1)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut);

  // Enhanced label placement
  const labels = svg.append('g')
    .selectAll('text')
    .data(root.descendants())
    .join('text')
    .attr('class', 'label')
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .style('font-size', d => {
      // Dynamically calculate font size based on circle radius
      const size = d.r / 3;
      return Math.min(Math.max(size, 8), 14) + 'px';
    })
    .style('font-weight', d => d.children ? 'bold' : 'normal')
    .style('pointer-events', 'none')
    .style('fill', d => d.children ? '#fff' : '#333')
    .style('text-shadow', d => d.children ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none')
    .each(function (d) {
      // Handle long text wrapping
      const node = d3.select(this);
      if (d.r > 20) {
        const words = d.data.name.split(/\s+/);
        if (words.length > 1 && d.r < 40) {
          // For smaller circles with multiple words, show only on hover
          node.text('')
            .append('tspan')
            .text('');
        } else {
          // For larger circles, wrap text
          let tspan = node.text('').append('tspan')
            .attr('x', d.x)
            .attr('y', d.y - (words.length - 1) * 8);

          words.forEach((word, i) => {
            tspan = node.append('tspan')
              .attr('x', d.x)
              .attr('dy', i ? '1.2em' : '0')
              .text(word);
          });
        }
      } else {
        node.text('');
      }
    });

  function createLegend(categories) {
    const legendContainer = document.getElementById('legend-items');

    if (!legendContainer) {
      console.error('Legend container not found!');
      return;
    }

    legendContainer.innerHTML = ''; // Clear existing items

    categories.forEach(category => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.marginBottom = '8px';

      const color = document.createElement('div');
      color.className = 'legend-color';
      color.style.background = 'url(#circle-gradient)';
      color.style.width = '16px';
      color.style.height = '16px';
      color.style.borderRadius = '50%';
      color.style.marginRight = '8px';

      const label = document.createElement('span');
      label.textContent = `${category.name} (${category.children.length} countries)`;
      label.style.fontSize = '14px';

      item.appendChild(color);
      item.appendChild(label);
      legendContainer.appendChild(item);
    });
  }
}
function handleMouseOver(event, d) {
  const tooltip = d3.select('.POPtooltip');
  const insightPanel = document.getElementById('insight-panel');

  // Tooltip transition
  tooltip.transition()
    .duration(200)
    .style('opacity', 1);

  let tooltipContent = '';
  if (d.children) {
    tooltipContent = `
      <div style="font-weight: bold; margin-bottom: 4px;">${d.data.name}</div>
      <div>Total Population: ${d3.format(',.0f')(d.value)}</div>
      <div>Countries: ${d.children.length}</div>
    `;
  } else {
    tooltipContent = `
      <div style="font-weight: bold; margin-bottom: 4px;">${d.data.name}</div>
      <div>Population: ${d3.format(',.0f')(d.value)}</div>
      <div>Growth Rate: ${d.data.growth}%</div>
    `;
  }

  tooltip.html(tooltipContent)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px');

  // Update insight panel with a smooth transition
  if (insights[d.data.name]) {
    insightPanel.querySelector('.insight-title').textContent = d.data.name;
    insightPanel.querySelector('.insight-content').textContent = insights[d.data.name];
    insightPanel.classList.remove('hidden');
    insightPanel.style.opacity = 0;
    setTimeout(() => {
      insightPanel.style.opacity = 1;
    }, 50);
  }

  // Highlight the selected circle
  d3.select(event.target)
    .transition()
    .duration(200)
    .style('stroke', '#fff')
    .style('stroke-width', 2);
}

function handleMouseOut(event, d) {
  // Smooth tooltip fade-out
  d3.select('.POPtooltip') // Corrected class name
    .transition()
    .duration(500)
    .style('opacity', 0);

  // Reset circle styling
  d3.select(event.target)
    .transition()
    .duration(200)
    .style('stroke', d.children ? 'none' : '#fff')
    .style('stroke-width', 1);

  // Hide insight panel
  const insightPanel = document.getElementById('insight-panel');
  if (insightPanel) {
    insightPanel.classList.add('hidden');
  }
}


function createLegend(categories) {
  const legendContainer = document.getElementById('legend-items');
  legendContainer.innerHTML = ''; // Clear existing items

  categories.forEach(category => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.marginBottom = '8px';

    const color = document.createElement('div');
    color.className = 'legend-color';
    color.style.background = 'url(#circle-gradient)';
    color.style.width = '16px';
    color.style.height = '16px';
    color.style.borderRadius = '50%';
    color.style.marginRight = '8px';

    const label = document.createElement('span');
    label.textContent = `${category.name} (${category.children.length} countries)`;
    label.style.fontSize = '14px';

    item.appendChild(color);
    item.appendChild(label);
    legendContainer.appendChild(item);
  });
}

// Initialize visualization on page load
document.addEventListener('DOMContentLoaded', initializeVisualization);

// Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    document.getElementById('visualization').innerHTML = '';
    initializeVisualization();
  }, 250);
});


