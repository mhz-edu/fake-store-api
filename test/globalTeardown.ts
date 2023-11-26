import { DataSource } from 'typeorm';

export default async function teardown() {
  await (globalThis.__dataSource__ as DataSource).destroy();
}
