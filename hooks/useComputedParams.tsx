import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router';

const ClassNameContext = React.createContext<string>('');

export const useComputedParams = (className?: string) => {
  const params = useParams<{ className?: string; id: string }>();
  const contextClassName = useContext(ClassNameContext);

  return useMemo<{ className: string; id: string }>(
    () => ({ className: className || contextClassName, ...params }),
    [params, contextClassName, className],
  );
};
