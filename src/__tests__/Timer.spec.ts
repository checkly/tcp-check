import { Timer } from '../Timer'
jest.useFakeTimers();

describe('Timer', () => {
  test('returns base Timings object with no marks', () => {
    const timings = {
      start: 0,
      lookup: 0,
      connect: 0,
      end: 0,
      error: 0,
      phases: {
        connect: 0,
        dns: 0,
        total: 0
      },
    }

    expect(new Timer().getTimings()).toEqual(timings)
  })
})
