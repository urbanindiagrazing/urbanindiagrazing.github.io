
async function loadMenu(containerId, jsonFile, allergensMap) {
  const container = document.getElementById(containerId);
  try {
    const response = await fetch(jsonFile);
    const data = await response.json();

    container.innerHTML = ''; // clear loading text

    // Determine whether prices should be shown via query param `showprices`
    const urlParams = new URLSearchParams(window.location.search);
    const _showpricesParam = (urlParams.get('showprices') || '').toLowerCase();
    const showPricesEnabled = _showpricesParam === 'true' || _showpricesParam === '1';

    data.sections.forEach(section => {
      const sectionDetails = document.createElement('details');
      sectionDetails.classList.add('section');

      const sectionSummary = document.createElement('summary');
      sectionSummary.textContent = section.section_name;
      sectionSummary.style.fontSize = '1.5em';
      sectionDetails.appendChild(sectionSummary);
      
      // Controls shown when the section is opened: Expand all / Collapse all
      const controls = document.createElement('div');
      controls.classList.add('section-controls');
      controls.style.display = 'none'; // Initially hidden
      controls.style.margin = '0.5em';

      const expandBtn = document.createElement('button');
      expandBtn.type = 'button';
      expandBtn.classList.add('expand-all');
      expandBtn.textContent = 'Show all descriptions';

      const collapseBtn = document.createElement('button');
      collapseBtn.type = 'button';
      collapseBtn.classList.add('collapse-all');
      collapseBtn.textContent = 'Hide all descriptions';
      collapseBtn.style.display = 'none'; // Initially hidden

      controls.appendChild(expandBtn);
      controls.appendChild(collapseBtn);
      sectionSummary.appendChild(controls);

      // Wire up expand/collapse for all menu items within this section
      sectionDetails.addEventListener('toggle', () => {
        if (sectionDetails.open) {
          controls.style.display = 'inline-block';
        } else {
          controls.style.display = 'none';
        }
      });

      expandBtn.addEventListener('click', () => {
        sectionDetails.querySelectorAll('.menu-item').forEach(d => d.open = true);
        expandBtn.style.display = 'none';
        collapseBtn.style.display = 'block';
      });

      collapseBtn.addEventListener('click', () => {
        sectionDetails.querySelectorAll('.menu-item').forEach(d => d.open = false);
        expandBtn.style.display = 'block';
        collapseBtn.style.display = 'none';
      });
      
      if (section.description) {
        const desc = document.createElement('p');
        desc.textContent = section.description;
        sectionDetails.appendChild(desc);
      }

      section.menu_items.forEach(item => {
        const itemDetails = document.createElement('details');
        itemDetails.classList.add('menu-item');

        const itemSummary = document.createElement('summary');

        // Name block so we can append a small protein badge after it
        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        nameSpan.style.fontSize = '1.25em';
        itemSummary.appendChild(nameSpan);

        // If a protein_type is provided, show the emoji and use allergensMap for the description tooltip
        if (item.protein_type) {
          const proteinSpan = document.createElement('span');
          proteinSpan.classList.add('protein-type');
          proteinSpan.textContent = ` ${item.protein_type}`;
          const desc = allergensMap?.[item.protein_type] || '';
          if (desc) proteinSpan.title = desc; // tooltip
          proteinSpan.setAttribute('aria-label', desc || item.protein_type);
          itemSummary.appendChild(proteinSpan);
        }

        // Price: show only when the query parameter `showprices` is true (or 1)
        if (showPricesEnabled && (item.price !== undefined && item.price !== null)) {
          const priceSpan = document.createElement('span');
          priceSpan.classList.add('price');
          // Format price using the menu currency if available
          let priceText = "";
          if (typeof item.price === 'string') priceText = item.price;
          if (typeof item.price === 'number' && item.price > 0) priceText = `\$ ${item.price}`;
          if (priceText && item.unit_of_measure) priceText += ` / `;
          if (item.unit_of_measure) priceText += item.unit_of_measure;
          priceSpan.textContent = priceText;
          itemSummary.appendChild(priceSpan);
        }

        itemDetails.appendChild(itemSummary);

        const desc = document.createElement('p');
        desc.classList.add('description');
        desc.textContent = item.description;
        itemDetails.appendChild(desc);

        if (item.allergens_list?.length) {
          const allergens = document.createElement('p');
          allergens.style.fontSize = '0.8em';
          allergens.classList.add('allergens');
          allergens.textContent = 'Contains: ';

          // Create multiple spans for each allergen with tooltip using allergensMap
          item.allergens_list.forEach(allergenCode => {
            const allergenSpan = document.createElement('div');
            allergenSpan.textContent = allergenCode + ' ' + allergensMap[allergenCode];
            allergens.appendChild(allergenSpan);
          });

          itemDetails.appendChild(allergens);
        }

        // if (item.spice_level?.length) {
        // 	const spice = document.createElement('p');
        // 	spice.classList.add('spice');
        // 	spice.textContent = `Spice Level: ${item.spice_level.join(', ')}`;
        // 	itemDetails.appendChild(spice);
        // }

        // if (item.tags?.length) {
        // 	const tags = document.createElement('p');
        // 	tags.classList.add('tags');
        // 	tags.textContent = `Tags: ${item.tags.join(', ')}`;
        // 	itemDetails.appendChild(tags);
        // }

        if (item.choices?.length) {
          const choices = document.createElement('p');
          choices.textContent = `Protien Choices: ${item.choices.join(', ')}`;
          itemDetails.appendChild(choices);
        }

        sectionDetails.appendChild(itemDetails);
      });

      container.appendChild(sectionDetails);
    });
  } catch (err) {
    container.textContent = 'Error loading menu: ' + err.message;
    console.error(err);
  }
}

async function loadAllergens(jsonFile) {
  const response = await fetch(jsonFile);
  const data = await response.json();
  return data;
}

const allergensMap = loadAllergens('/allergens.json').then(allergens => {
  loadMenu('grazing-menu-container', '/menu.json', allergens);
});