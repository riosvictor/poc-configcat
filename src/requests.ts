const baseUrl = 'https://api.configcat.com';

type TProduct = {
  productId: string;
  name?: string;
  description?: string;
  order: number;
  reasonRequired: boolean;
}
type TPermission = {
  permissionGroupId: number,
  name: string,
}
type TResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
}

const token = btoa(`${process.env.USERNAME}:${process.env.PASSWORD}`)

export async function getProducts(): Promise<TProduct[]> {
  const url = `${baseUrl}/v1/products`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    if (response.ok) {
      const products = await response.json();
      return products as TProduct[];
    }

    throw new Error(response.statusText);
  } catch (error) {
    console.error(JSON.stringify(error));
    return [];
  }
}

export async function createProduct(name: string): Promise<TResponse<TProduct>> {
  const url = `${baseUrl}/v1/organizations/${process.env.ORG_ID}/products`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });
    const data = await response.json() as TProduct;

    if (response.ok) {
      return {
        ok: true,
        data,
      };
    }

    throw new Error(response.statusText);
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      ok: false,
      error: (error as any)?.message || 'Unknown error',
    }
  }
}

export async function addMembers(productId: string, emails: string[], permission: string): Promise<TResponse<any>> {
  const responsePermission = await getPermissions(productId);

  if (!responsePermission.ok) {
    return {
      ok: false,
      error: 'Failed to get permissions',
    };
  }

  const permissionId = responsePermission.data?.find((p) => p.name.toLowerCase() === permission.toLowerCase())?.permissionGroupId;

  if (!permissionId) {
    return {
      ok: false,
      error: 'Permission not found',
    };
  }

  const url = `${baseUrl}/v1/products/${productId}/members/invite`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emails,
        permissionGroupId: permissionId,
      }),
    });

    if (response.ok) {
      return {
        ok: true,
      };
    }

    throw new Error(response.statusText);
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      ok: false,
      error: (error as any)?.message || 'Unknown error',
    }
  }
}

export async function getPermissions(productId: string): Promise<TResponse<TPermission[]>> {
  const url = `${baseUrl}/v1/products/${productId}/permissions`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const permissions = await response.json() as TPermission[];
      return {
        ok: true,
        data: permissions,
      };
    }

    throw new Error(response.statusText);
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      ok: false,
      error: (error as any)?.message || 'Unknown error',
    }
  }
}