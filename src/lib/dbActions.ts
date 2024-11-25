'use server';

import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DayMenu {
  name: string;
  plateLunch: string[];
  grabAndGo: string[];
  specialMessage: string;
}

enum Location {
  CAMPUS_CENTER = 'CAMPUS_CENTER',
  GATEWAY = 'GATEWAY',
  HALE_ALOHA = 'HALE_ALOHA',
}

function getCurrentWeek(): string {
  const today = new Date();
  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = today.getDay();
  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  // Format the date as yyyy-mm-dd
  const yyyy = startOfWeek.getFullYear();
  const mm = String(startOfWeek.getMonth() + 1).padStart(2, '0');
  const dd = String(startOfWeek.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Creates a new menu in the database.
 * @param menuRow, an object with the following properties: email, password.
 */
export async function insertMenu(menuInfo: DayMenu[], location: Location, language: string, country: string) {
  try {
    const weekOf = getCurrentWeek();
    const weekMenu = JSON.parse(JSON.stringify(menuInfo));
    await prisma.menus.create({
      data: {
        week_of: weekOf,
        location,
        menu: weekMenu,
        language,
        country,
      },
    });
  } catch (error) {
    console.error('Error inserting menu:', error);
    throw error;
  }
}

/**
 * Edits a menu in the database.
 * @param id - The ID of the menu to edit.
 * @param data - The new data for the menu.
 * @returns the updated menu object.
 */
export async function editMenu(id: number, data: any) {
  try {
    return await prisma.menus.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error editing menu:', error);
    throw error;
  }
}

/**
 * Deletes a menu from the database.
 * @param id - The ID of the menu to delete.
 * @returns the deleted menu object.
 */
export async function deleteMenu(id: number) {
  try {
    return await prisma.menus.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    throw error;
  }
}

/**
 * Retrieves a menu from the database.
 * @param id, the ID of the menu to retrieve.
 * @returns the menu object.
 */
export async function getMenu(week_of: string, language: string) {
  try {
    return await prisma.menus.findFirst({
      where: {
        week_of,
        language,
      },
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
}

/**
 * Retrieves the latest menu from the database using the week_of field.
 * @returns the latest menu object.
 */
export async function getLatestMenu(language: string) {
  try {
    return await prisma.menus.findFirst({
      where: {
        language,
      },
      orderBy: {
        week_of: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching latest menu:', error);
    throw error;
  }
}

/**
 * Retrieves all menus from the database.
 * @returns an array of menu objects.
 */
export async function getAllMenus() {
  try {
    return await prisma.menus.findMany();
  } catch (error) {
    console.error('Error fetching all menus:', error);
    throw error;
  }
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; username: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      username: credentials.username,
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
