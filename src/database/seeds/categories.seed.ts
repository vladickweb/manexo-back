import { DataSource } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Subcategory } from '../../category/entities/subcategory.entity';

export async function seedCategories(dataSource: DataSource): Promise<void> {
  const categoryRepository = dataSource.getRepository(Category);
  const subcategoryRepository = dataSource.getRepository(Subcategory);

  const categories = [
    {
      name: 'Hogar',
      description: 'Servicios de hogar',
      icon: 'home',
      subcategories: [
        {
          name: 'Plancha',
          description: 'Servicio de planchado a domicilio',
          icon: 'ironing',
        },
        {
          name: 'Limpieza',
          description: 'Servicio de limpieza del hogar',
          icon: 'cleaning',
        },
        {
          name: 'Manitas',
          description: 'Reparaciones y mantenimiento del hogar',
          icon: 'handyman',
        },
        {
          name: 'Jardinería',
          description: 'Mantenimiento de jardines',
          icon: 'gardening',
        },
      ],
    },
    {
      name: 'Clases',
      description: 'Servicios de clases',
      icon: 'book',
      subcategories: [
        {
          name: 'Música',
          description: 'Clases de música',
          icon: 'music',
        },
        {
          name: 'Idiomas',
          description: 'Clases de idiomas',
          icon: 'languages',
        },
        {
          name: 'Colegio',
          description: 'Apoyo escolar',
          icon: 'school',
        },
      ],
    },
    {
      name: 'Deporte',
      description: 'Servicios de deporte',
      icon: 'sport',
      subcategories: [
        {
          name: 'Boxeo',
          description: 'Clases de boxeo',
          icon: 'boxing',
        },
        {
          name: 'Personal Training',
          description: 'Entrenamiento personalizado',
          icon: 'trainer',
        },
        {
          name: 'Yoga',
          description: 'Clases de yoga',
          icon: 'yoga',
        },
        {
          name: 'Pilates',
          description: 'Clases de pilates',
          icon: 'pilates',
        },
        {
          name: 'Pádel',
          description: 'Clases de pádel',
          icon: 'padel',
        },
        {
          name: 'Tenis',
          description: 'Clases de tenis',
          icon: 'tennis',
        },
      ],
    },
    {
      name: 'Cuidados',
      description: 'Servicios de cuidados',
      icon: 'care',
      subcategories: [
        {
          name: 'Niños',
          description: 'Cuidado de niños',
          icon: 'childcare',
        },
        {
          name: 'Ancianos',
          description: 'Cuidado de ancianos',
          icon: 'eldercare',
        },
      ],
    },
    {
      name: 'Mascotas',
      description: 'Servicios de mascotas',
      icon: 'dog',
      subcategories: [
        {
          name: 'Peluquería',
          description: 'Peluquería para mascotas',
          icon: 'petgrooming',
        },
        {
          name: 'Paseador',
          description: 'Servicio de paseo de perros',
          icon: 'dogwalker',
        },
      ],
    },
    {
      name: 'Otros',
      description: 'Otros servicios',
      icon: 'other',
      subcategories: [
        {
          name: 'Fotógrafo',
          description: 'Servicios de fotografía',
          icon: 'photographer',
        },
        {
          name: 'Masajista',
          description: 'Servicios de masajes',
          icon: 'massage',
        },
        {
          name: 'Fisioterapeuta',
          description: 'Servicios de fisioterapia',
          icon: 'physio',
        },
      ],
    },
  ];

  for (const categoryData of categories) {
    const category = categoryRepository.create({
      name: categoryData.name,
      description: categoryData.description,
      icon: categoryData.icon,
    });

    const savedCategory = await categoryRepository.save(category);

    for (const subcategoryData of categoryData.subcategories) {
      const subcategory = subcategoryRepository.create({
        name: subcategoryData.name,
        description: subcategoryData.description,
        icon: subcategoryData.icon,
        category: savedCategory,
      });

      await subcategoryRepository.save(subcategory);
    }
  }
}
