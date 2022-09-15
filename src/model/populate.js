const pois = [
  {
    id: 'nilfgaardian_garrison',
    coordinates: { x: 160, y: 137 },
    properties: {
      signpost: true,
      grindstone: true,
      armorers_table: true,
      blacksmith: true,
    },
    items: [
      {
        name: 'Holy battle hammer of the Order',
        value: 400,
        weight: 5000,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/5/54/Weapons_Holy_battle_hammer_of_the_order.png',
      },
    ],
  },
  {
    id: 'poi_01',
    coordinates: { x: 262, y: 165 },
    properties: {
      guarded_treasure: true,
    },
    items: [
      {
        name: 'Bread',
        value: 1,
        weight: 100,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/b/b7/Food_Bread.png',
      },
    ],
  },
  {
    id: 'poi_04',
    coordinates: { x: 282, y: 344 },
    properties: { place_of_power: true, wild: true },
    items: [
      {
        name: 'Buttermilk',
        value: 9,
        weight: 175,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/a/af/Drink_Cow_Milk.png',
      },
    ],
  },
  {
    id: 'sawmill',
    coordinates: { x: 213, y: 496 },
    properties: { signpost: true },
    items: [
      {
        name: 'Cintrian Faro',
        value: 5,
        weight: 350,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/2/2b/Alcohol_Cintrian_Faro.png',
      },
      {
        name: 'Kaedwenian Stout\t',
        value: 5,
        weight: 350,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/4/42/Alcohol_Kaedwenian_Stout.png',
      },
      {
        name: ' Redanian Lager',
        value: 5,
        weight: 350,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/8/8a/Alcohol_Redanian_Lager.png',
      },
    ],
  },
  {
    id: 'woesong_bridge',
    coordinates: { x: 587, y: 510 },
    properties: {
      signpost: true,
      gwent_player: true,
      innkeep: true,
      shopkeep: true,
    },
    items: [
      {
        name: 'Temerian battle flail',
        value: 200,
        weight: 2330,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/d/d8/Weapons_Temerian_Battle_flail.png',
      },
    ],
  },
  {
    id: 'mill',
    coordinates: { x: 509, y: 312 },
    properties: {
      signpost: true,
    },
    items: [
      {
        name: 'Temerian battle flail',
        value: 500,
        weight: 345,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/8/8e/Quest_Items_magic_stone.png',
      },
    ],
  },
  {
    id: 'poi_15',
    coordinates: { x: 485, y: 203 },
    properties: {
      place_of_power: true,
      special_item: true,
    },
    items: [
      {
        name: "Traveler's diary",
        value: 15,
        weight: 760,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/7/7d/Quest_Items_Tower_mages_book_small.png',
      },
    ],
  },
  {
    id: 'cackler_bridge',
    coordinates: { x: 945, y: 298 },
    properties: {
      signpost: true,
    },
    items: [
      {
        name: 'Mahakaman Battle Hammer',
        value: 400,
        weight: 80,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/8/81/Weapons_Mahakaman_battle_hammer.png',
      },
    ],
  },
  {
    id: 'ransacked_village',
    coordinates: { x: 1026, y: 598 },
    properties: {
      signpost: true,
    },
    items: [
      {
        name: 'Very Old Wine',
        value: 400,
        weight: 85,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/6/6b/Alcohol_Toussaint_Red.png',
      },
      {
        name: 'The History of the World',
        value: 8,
        weight: 55,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/3/33/Books_Generic_other.png',
      },
      {
        name: 'Temerian iron dagger',
        value: 10,
        weight: 450,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/e/ec/Weapons_Temerian_iron_dagger.png',
      },
    ],
  },
  {
    id: 'poi_30',
    coordinates: { x: 392, y: 316 },
    properties: {
      hidden_treasure: true,
    },
    items: [
      {
        name: 'Uroboros_amulet',
        value: 80,
        weight: 230,
        imageUrl: 'https://static.wikia.nocookie.net/witcher/images/7/71/Quest_Items_uroboros_amulet.png',
      },
    ],
  },
];

export const populateItems = () => {
  if (!localStorage.getItem('alreadyPopulated')) {
    const storageNodes = JSON.parse(localStorage.getItem('nodes') || '{}');

    pois.forEach((poi) => {
      if (poi.items && poi.items.length > 0) {
        storageNodes[poi.id].items = [...poi.items];
      }
    });

    localStorage.setItem('nodes', JSON.stringify(storageNodes));
    localStorage.setItem('alreadyPopulated', 'true');
  }
};
