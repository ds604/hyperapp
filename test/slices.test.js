import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("slices", done => {
  const bar = {
    state: {
      value: true
    },
    actions: {
      change: () => state => ({ value: !state.value })
    }
  }

  const foo = {
    state: {
      value: true,
      bar: bar.state
    },
    actions: {
      up: () => state => ({ value: !state.value }),
      bar: bar.actions
    }
  }

  const state = {
    foo: foo.state
  }

  const actions = {
    foo: foo.actions,
    getState: () => state => state
  }

  const App = app(state, actions, () => {})

  expect(App.getState()).toEqual({
    foo: {
      value: true,
      bar: {
        value: true
      }
    }
  })

  expect(App.foo.up()).toEqual({ value: false })
  expect(App.foo.bar.change()).toEqual({ value: false })

  done()
})

test("state/actions tree", done => {
  const actions = {
    fizz: {
      buzz: {
        fizzbuzz: () => ({ value: "fizzbuzz" })
      }
    }
  }

  const view = state =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>fizzbuzz</div>`)
          done()
        }
      },
      state.fizz.buzz.value
    )

  const App = app({}, actions, view, document.body)

  App.fizz.buzz.fizzbuzz()
})
