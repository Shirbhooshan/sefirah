export interface FileSystemItem {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getFileSystem(
  parentId: string | null = null
): Promise<FileSystemItem[]> {
  const url = parentId
    ? `/api/filesystem?parentId=${encodeURIComponent(parentId)}`
    : "/api/filesystem";

  const response = await fetch(url, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to load filesystem."
    );
  }

  return data.items;
}

export async function getFile(
  id: string
): Promise<FileSystemItem> {
  const response = await fetch(
    `/api/filesystem/${encodeURIComponent(id)}`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to open file."
    );
  }

  return data.item;
}

export async function createFolder(
  name: string,
  parentId: string | null = null
) {
  const response = await fetch(
    "/api/filesystem/folder",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        parentId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to create folder."
    );
  }

  return data.folder;
}

export async function createFile(
  name: string,
  content = "",
  parentId: string | null = null
) {
  const response = await fetch(
    "/api/filesystem/file",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        content,
        parentId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to create file."
    );
  }

  return data.file;
}

export async function updateFile(
  id: string,
  updates: {
    name?: string;
    content?: string;
    parentId?: string | null;
  }
) {
  const response = await fetch(
    `/api/filesystem/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to update item."
    );
  }

  return data.item;
}

export async function deleteFileSystemItem(
  id: string
) {
  const response = await fetch(
    `/api/filesystem/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to delete item."
    );
  }

  return true;
}