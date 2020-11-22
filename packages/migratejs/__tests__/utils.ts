import path from 'path';

export const resolveFixture = (fixtureName: string): string => {
  return path.resolve(__dirname, 'fixtures', fixtureName);
};
