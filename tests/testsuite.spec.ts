import { test, expect, APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

const BASE_URL = 'http://localhost:3000';

test.describe('TheTester Hotel API Tests', () => {
  let request: APIRequestContext;
  let token: string;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: BASE_URL,
    });


    const loginResponse = await request.post('/api/login', {
      data: {
        username: 'tester01',
        password: 'GteteqbQQgSr88SwNExUQv2ydb7xuf8c',
      },
      headers: { 'Content-Type': 'application/json' },
    });
    const loginData = await loginResponse.json();
    token = loginData.token;
  });

  // 1. Hämta alla fakturor
  test('TC 01 - hämta alla fakturor', async () => {
    const response = await request.get('/api/bills', {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const bills = await response.json();
    expect(bills.length).toBeGreaterThan(0);
  });

  // 2. Hämta faktura med ID
  test('TC 02 - Hämta faktura med ID', async () => {
    const billId = 1;
    const response = await request.get(`/api/bill/${billId}`, {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    const bill = await response.json();
    expect(bill.id).toBe(billId);
  });

  // 3. Radera faktura med ID
  test('TC 03 - Radera faktura med ID', async () => {
    const billId = 1;
    const deleteResponse = await request.delete(`/api/bill/${billId}`, {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(deleteResponse.ok()).toBeTruthy();

    const getResponse = await request.get(`/api/bill/${billId}`, {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(getResponse.status()).toBe(404);
  });

  // 4. Hitta alla kunder
  test('TC 04 - Hitta alla kunder', async () => {
    const response = await request.get('/api/clients', {
      headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const clients = await response.json();
    expect(clients.length).toBeGreaterThan(0);
  });

  // 5. Uppdatera bokning
  test('TC 05 - Uppdatera bokning', async () => {
    const reservationId = 1;
    const payload = {
      start: '2024-12-26',
      end: '2025-01-02',
      client: 'Alexandra Andersson',
      room: 'Floor 3, Room 302',
      bill: 'ID: 1',
    };

    const response = await request.put(`/api/reservation/${reservationId}`, {
      data: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-user-auth': JSON.stringify({ username: 'tester01', token }),
      },
    });
    expect(response.ok()).toBeTruthy();

    const updatedReservation = await response.json();
    expect(updatedReservation.start).toBe(payload.start);
    expect(updatedReservation.end).toBe(payload.end);
    expect(updatedReservation.client).toBe(payload.client);
    expect(updatedReservation.room).toBe(payload.room);
    expect(updatedReservation.bill).toBe(payload.bill);
  });

  // 6. Skapa ny kund
  test('TC 06 - Skapa ny kund', async () => {
    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };
    const response = await request.post('/api/client/new', {
      data: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-user-auth': JSON.stringify({ username: 'tester01', token }),
      },
    });
    expect(response.ok()).toBeTruthy();
    const client = await response.json();
    expect(client.name).toBe(payload.name);
    expect(client.email).toBe(payload.email);
  });

      // 7. Hitta kund med ID
      test('TC 07 - Hitta kund med ID', async () => {
        const clientId = 2;
        const response = await request.get(`/api/client/${clientId}`, {
          headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
        });
        expect(response.ok()).toBeTruthy();
        const client = await response.json();
        expect(client.id).toBe(clientId);
      });

   // 8. Uppdatera kund
   test('TC 08 - Uppdatera kund', async () => {
    const clientId = 1;
    const payload = {
      id: '2',
      name: 'Mikael Eriksson',
      email: 'mikael.eriksson@example.com',
    };
    const response = await request.put(`/api/client/${clientId}`, {
      data: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-user-auth': JSON.stringify({ username: 'tester01', token }),
      },
    });
    expect(response.ok()).toBeTruthy();
    const updatedClient = await response.json();
    expect(updatedClient.name).toBe(payload.name);
  });

    // 9. Hitta rum med ID
    test('TC 09 - Hitta rum med ID', async () => {
        const roomId = 1;
        const response = await request.get(`/api/room/${roomId}`, {
          headers: { 'X-user-auth': JSON.stringify({ username: 'tester01', token }) },
        });
        expect(response.ok()).toBeTruthy();
    
        const room = await response.json();
        expect(room.id).toBe(roomId);
      });