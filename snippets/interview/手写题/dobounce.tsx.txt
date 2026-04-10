import { isFunction } from '@jdplus/k2';
import { useMemo, useRef } from 'react';

import debounce from '../useRequest/utils/debounce';
import { useUnmount } from '../useUnmount/useUnmount';
import { useUpdateEffect } from '../useUpdateEffect/useUpdateEffect';
type noop = (...args: any) => any;
export const useDebounce = <T extends noop>(
    fn: T,
    wait: number = 0,
    immediate?: boolean,
) => {
    if (!isFunction(fn)) {
        return console.error('fn 必须为函数');
    }
    const fnRef = useRef(fn);
    fnRef.current = fn; //更新ref 值

    const debounced = useMemo(() => {
        return debounce(
            (...args: any[]) => {
                return fnRef.current(...args);
            },
            wait,
            immediate,
        );
    }, [wait, immediate]);

    useUpdateEffect(() => {
        debounced();
    }, [debounced]);

    useUnmount(() => {
        debounced.cancel();
    });

    return debounced;
};

export default useDebounce;
