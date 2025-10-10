
async function loadMenu(containerId, jsonFile, allergensMap) {
  const container = document.getElementById(containerId);
  try {
    const response = await fetch(jsonFile);
    const data = await response.json();

    container.innerHTML = ''; // clear loading text

    data.sections.forEach(section => {
      const sectionDetails = document.createElement('details');
      sectionDetails.classList.add('section');

      const sectionSummary = document.createElement('summary');
      sectionSummary.textContent = section.section_name;
      sectionSummary.style.fontSize = '1.5em';
      sectionDetails.appendChild(sectionSummary);

      if (section.description) {
        const desc = document.createElement('p');
        desc.textContent = section.description;
        sectionDetails.appendChild(desc);
      }

      section.menu_items.forEach(item => {
        const itemDetails = document.createElement('details');
        itemDetails.classList.add('menu-item');

        const itemSummary = document.createElement('summary');
        itemSummary.textContent = `${item.icon} ${item.name}`;
        itemSummary.style.fontSize = '1.25em';
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

const allergensMap = loadAllergens('allergens.json').then(allergens => {
  loadMenu('grazing-menu-container', 'grazing-menu.json', allergens);
  loadMenu('elevated-menu-container', 'elevated-menu.json', allergens);
});