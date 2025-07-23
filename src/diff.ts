//

type keys = string;

interface Changed {
  removed: keys[];
  added: keys[];
  changed: keys[];
}

export const GetObjDiff = (
  oldN: Record<string, any>,
  newN: Record<string, any>
): Changed => {
  const oldKeys = Object.keys(oldN);
  const newKeys = Object.keys(newN);

  const removed: keys[] = [];
  const added: keys[] = [];
  const changed: keys[] = [];

  newKeys.forEach((key) => {
    if (!oldKeys.includes(key)) {
      added.push(key);
    }
  });

  oldKeys.forEach((key) => {
    if (!newKeys.includes(key)) {
      removed.push(key);
    }
  });

  Object.entries(newN).forEach(([k, v]) => {
    if (oldN[k] as any) {
      if (oldN[k] !== v) {
        changed.push(k);
      }
    }
  });

  return {
    removed,
    added,
    changed,
  };
};
