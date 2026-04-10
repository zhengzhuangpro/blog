import { isFunction } from '@jdplus/k2';
import { useCallback, useRef } from 'react';

import { useUnmount } from '../useUnmount/useUnmount';
import { useUpdateEffect } from '../useUpdateEffect/useUpdateEffect';
type noop = (...args: any) => any;

export const useThrottle = <T extends noop>(fn: T, wait: number = 0) => {
    if (!isFunction(fn)) {
        return console.error('fn 必须为函数');
    }

    const timer = useRef < any > ();
    const fnRef = useRef < noop > (fn);
    const currentArgs = useRef < any > ([]);
    fnRef.current = fn; //更新fn 函数

    const cancel = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = undefined;
    }, []);

    const throttled = useCallback(
        (...args: any) => {
            currentArgs.current = args;
            if (!timer.current) {
                //timer 为空代表没有定时任务或上一个任务已执行完毕则可以再次设置定时任务
                timer.current = setTimeout(() => {
                    fnRef.current(...currentArgs.current);
                    timer.current = undefined;
                }, wait);
            }
        },
        [wait, cancel],
    );

    useUpdateEffect(() => {
        throttled();
    }, [throttled]);

    useUnmount(() => {
        cancel();
    });

    return throttled;
};

export default useThrottle;
