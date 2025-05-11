import { DataSource } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const adminUser = {
    email: 'vladickbaraza@gmail.com',
    password: await bcrypt.hash('adminadmin', 10),
    firstName: 'Vladimir',
    lastName: 'Baraza',
    role: 'admin',
    isActive: true,
  };

  const existingUser = await userRepository.findOne({
    where: { email: adminUser.email },
  });

  if (!existingUser) {
    await userRepository.save(adminUser);
  }
}
