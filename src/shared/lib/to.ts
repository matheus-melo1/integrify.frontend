type Result<T> = [Error, null] | [null, T];

export const to = async <T>(promise: Promise<T>): Promise<Result<T>> => {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null];
  }
};
