import { renderHook, waitFor } from '@testing-library/react-native';
import { useDebounce } from '../../src/hooks/useDebounce';

describe('useDebounce Hook', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 50));

    expect(result.current).toBe('initial');
  });

  it('should debounce string values correctly', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 50 } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 50 });

    // Should still have the old value immediately
    expect(result.current).toBe('initial');

    // Wait for debounce to complete
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 }
    );
  });

  it('should handle rapid consecutive updates correctly', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 50 } }
    );

    expect(result.current).toBe('first');

    // Rapid consecutive updates
    rerender({ value: 'second', delay: 50 });
    rerender({ value: 'third', delay: 50 });
    rerender({ value: 'fourth', delay: 50 });

    // Should still have the initial value immediately
    expect(result.current).toBe('first');

    // Wait for debounce to complete - should show the last value
    await waitFor(
      () => {
        expect(result.current).toBe('fourth');
      },
      { timeout: 200 }
    );
  });

  it('should work with different data types', async () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 50 } }
    );

    numberRerender({ value: 42, delay: 50 });

    await waitFor(
      () => {
        expect(numberResult.current).toBe(42);
      },
      { timeout: 200 }
    );

    // Test with objects
    const initialObj = { id: 1, name: 'test' };
    const updatedObj = { id: 2, name: 'updated' };

    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 50 } }
    );

    objectRerender({ value: updatedObj, delay: 50 });

    await waitFor(
      () => {
        expect(objectResult.current).toEqual(updatedObj);
      },
      { timeout: 200 }
    );

    // Test with arrays
    const { result: arrayResult, rerender: arrayRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: [1, 2, 3], delay: 50 } }
    );

    arrayRerender({ value: [4, 5, 6], delay: 50 });

    await waitFor(
      () => {
        expect(arrayResult.current).toEqual([4, 5, 6]);
      },
      { timeout: 200 }
    );
  });

  it('should cleanup timeouts on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // Unmount before timeout completes
    unmount();

    // Should have called clearTimeout
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('should handle null and undefined values', async () => {
    // Test with null values
    const { result: nullResult, rerender: nullRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: null as string | null, delay: 50 } }
    );

    expect(nullResult.current).toBe(null);

    nullRerender({ value: 'not-null', delay: 50 });

    await waitFor(
      () => {
        expect(nullResult.current).toBe('not-null');
      },
      { timeout: 200 }
    );

    // Test with undefined values
    const { result: undefinedResult, rerender: undefinedRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: undefined as string | undefined, delay: 50 } }
    );

    expect(undefinedResult.current).toBe(undefined);

    undefinedRerender({ value: 'defined', delay: 50 });

    await waitFor(
      () => {
        expect(undefinedResult.current).toBe('defined');
      },
      { timeout: 200 }
    );
  });
});
