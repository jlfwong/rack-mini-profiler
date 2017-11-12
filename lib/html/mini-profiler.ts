interface Result {
  id: string
  method: string
  url: string
  duration: number
}

interface Options {
  path: string
}

interface State {
  results: Result[]
}

const state: State = {
  results: []
}

type StateChangeListener = (state: State) => void
const stateChangeListeners: StateChangeListener[] = []
function addStateChangeListenener(listener: StateChangeListener) {
  stateChangeListeners.push(listener)
}

function set(toSet: Partial<State>) {
  Object.assign(state, toSet)
  stateChangeListeners.forEach(f => f(state))
}

function fetchResult(id: string, options: Options) {
  const req = new XMLHttpRequest
  req.addEventListener("load", () => {
    console.log(arguments)
  })
  req.open("GET", `${options.path}results?id=${id}`)

  // This forces rack to recognize this as an xhr
  // See: https://apidock.com/rails/Rack/Request/xhr%3F
  req.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest')

  req.send()
}

function getOptions(script: HTMLScriptElement) {
  const version = script.getAttribute('data-version')!;
  const path = script.getAttribute('data-path')!;

  const currentId = script.getAttribute('data-current-id')!;

  const ids = (script.getAttribute('data-ids') || '').split(',')

  const horizontalPosition = script.getAttribute('data-horizontal-position');
  const verticalPosition = script.getAttribute('data-vertical-position');
  const toggleShortcut = script.getAttribute('data-toggle-shortcut');
  const collapseResults = script.getAttribute('data-collapse-results') === 'true';
  const trivial = script.getAttribute('data-trivial') === 'true';
  const children = script.getAttribute('data-children') === 'true';
  const controls = script.getAttribute('data-controls') === 'true';
  const authorized = script.getAttribute('data-authorized') === 'true';
  const startHidden = script.getAttribute('data-start-hidden') === 'true';
  const htmlContainer = script.getAttribute('data-html-container');

  return {
    ids: ids,
    path: path,
    version: version,
    renderHorizontalPosition: horizontalPosition,
    renderVerticalPosition: verticalPosition,
    showTrivial: trivial,
    showChildrenTime: children,
    showControls: controls,
    currentId: currentId,
    authorized: authorized,
    toggleShortcut: toggleShortcut,
    startHidden: startHidden,
    collapseResults: collapseResults,
    htmlContainer: htmlContainer
  };
}

function init() {
  const script = document.getElementById('mini-profiler');
  if (!script || !script.getAttribute) return;
  const options = getOptions(script as HTMLScriptElement)
  fetchResult(options.currentId, options)
}

init()