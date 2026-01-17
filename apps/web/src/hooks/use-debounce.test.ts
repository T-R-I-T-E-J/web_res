import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './use-debounce'

// Mock setTimeout
jest.useFakeTimers()

describe('useDebounce', () => {
    it('should return the initial value', () => {
        const { result } = renderHook(() => useDebounce('initial', 500))
        expect(result.current).toBe('initial')
    })

    it('should debounce value updates', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        )

        // Update value
        rerender({ value: 'updated', delay: 500 })

        // Should still be initial value immediately
        expect(result.current).toBe('initial')

        // Fast-forward time by 200ms (less than delay)
        act(() => {
            jest.advanceTimersByTime(200)
        })
        expect(result.current).toBe('initial')

        // Fast-forward time by remaining 300ms
        act(() => {
            jest.advanceTimersByTime(300)
        })
        expect(result.current).toBe('updated')
    })

    it('should use default delay of 500ms if not provided', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value),
            { initialProps: { value: 'initial' } }
        )

        rerender({ value: 'updated' })

        act(() => {
            jest.advanceTimersByTime(499)
        })
        expect(result.current).toBe('initial')

        act(() => {
            jest.advanceTimersByTime(1)
        })
        expect(result.current).toBe('updated')
    })
})
