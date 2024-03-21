export function groupPermissionsByModule(
  permissions: any,
): Array<{ module: string; actions: Array<any> }> {
  return Object.values(
    permissions.reduce((acc: any, { module, ...rest }: any) => {
      if (!acc[module]) {
        acc[module] = { module, actions: [] };
      }
      acc[module].actions.push({ ...rest });
      return acc;
    }, {}),
  );
}

export function convertRolesToPermissions(roles: any) {
  const setOfPermissions = new Set(
    roles.reduce(
      (acc: any, role: any) => [...acc, ...(role?.permissions || [])],
      [],
    ),
  );
  return [...setOfPermissions] as Array<string>;
}
