import { useMemo } from 'react';
import { v4 as uuid } from "uuid";


const useUniqueId = (prefix: string): string => {
  const id = useMemo(uuid, [prefix]);
  return `${prefix}-${id}`;
};

export default useUniqueId;