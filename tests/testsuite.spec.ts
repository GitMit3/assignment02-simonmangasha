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