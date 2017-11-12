import { h, render, Component } from 'preact';

interface Result {
  id: string
  method: string
  urlPath: string
  durationMs: number
}

interface Options {
  path: string
  currentId: string
}

type XhrOpenListener = (xhr: XMLHttpRequest) => void
const xhrOpenListeners: XhrOpenListener[] = []
function addXhrOpenListener(cb: XhrOpenListener) {
  xhrOpenListeners.push(cb)
}
const realOpen = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function(this: XMLHttpRequest, ...args: any[]) {
  const ret = realOpen.apply(this, args)
  xhrOpenListeners.forEach(f => f(this))
  return ret
}

function fetchResult(id: string, options: Options): Promise<Result> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest
    req.addEventListener("load", () => {
      const response = JSON.parse(req.responseText)
      const root = response.root
      const name = root.name
      const [method, ...urlParts] = name.split(' ')
      const url = new URL(urlParts.join(' '))
      resolve({
        id: response.id as string,
        durationMs: root.duration_milliseconds as number,
        method: method as string,
        urlPath: url.pathname as string
      })
    })
    req.open("GET", `${options.path}results?id=${id}`)

    // This forces rack to recognize this as an xhr
    // See: https://apidock.com/rails/Rack/Request/xhr%3F
    // req.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest')
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    req.send()
  })
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

interface MiniProfilerState {
  results: Result[]
}

class Details extends Component<MiniProfilerState, void> {
  rowStyle = {
    width: 300,
    height: 24,
    fontSize: '10px',
    lineHeight: '24px',
    color: '#F2F2F2',
    fontFamily: 'Monaco, Courier, monospace',
    display: 'flex',
    pointerEvents: 'auto'
  }

  oddRowStyle = {
    ...this.rowStyle,
    backgroundColor: '#222222'
  }

  evenRowStyle = {
    ...this.rowStyle,
    backgroundColor: '#050505'
  }

  durationStyle = {
    width: 60,
    display: 'block',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingRight: 6,
    textAlign: 'right'
  }

  urlStyle = {
    display: 'block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingLeft: 6,
    flex: 1
  }

  boldStyle = {
    fontWeight: 'bold'
  }

  renderResult = (result: Result, index: number) => {
    return <div style={index % 2 === 0 ? this.evenRowStyle : this.oddRowStyle}>
      <span style={this.durationStyle}>
        <span style={this.boldStyle}>{Math.round(result.durationMs)}</span>ms
      </span>
      <span style={this.urlStyle}>
        <span style={this.boldStyle}>{result.method}</span>
        {' '}
        {result.urlPath}
      </span>
    </div>
  }

  render() {
    return <div>{this.props.results.map(this.renderResult)}</div>
  }
}

class EntryPoint extends Component<MiniProfilerState, void> {
  style = {
    width: 102,
    height: 24,
    fontFamily: 'Monaco, Courier, monospace',
    fontSize: '10px',
    lineHeight: '24px',
    backgroundColor: '#050505',
    color: '#E0E0E0',
    textAlign: 'center',
    userSelect: 'none',
    pointerEvents: 'auto'
  }

  boldStyle = {
    fontWeight: 'bold'
  }

  render() {
    const max = Math.round(Math.max(...(this.props.results.map(res => res.durationMs))))
    return <div style={this.style}>
      <span style={this.boldStyle}>{max}</span>ms max/{this.props.results.length}
    </div>
  }
}

class MiniProfiler extends Component<{}, MiniProfilerState> {
  private resultById: {[key: string]: Promise<Result>} = Object.create(null)
  private options: Options

  constructor() {
    super()

    const script = document.getElementById('mini-profiler');
    if (!script || !script.getAttribute) return;
    this.options = getOptions(script as HTMLScriptElement)

    this.state = {
      results: []
    }
  }

  fetchResultOnce = (id: string): Promise<Result> => {
    if (!this.resultById[id]) {
      this.resultById[id] = fetchResult(id, this.options).then((result) => {
        this.setState({results: [...this.state.results, result]})
        return result
      })
    }
    return this.resultById[id]
  }

  componentDidMount() {
    addXhrOpenListener((xhr) => {
      xhr.addEventListener('load', () => {
        if (xhr.responseURL.indexOf(this.options.path) !== -1) return
        const ids = xhr.getResponseHeader('X-MiniProfiler-Ids')
        if (ids) {
          const idList: string[] = JSON.parse(ids)
          idList.forEach(this.fetchResultOnce)
        }
      })
    })
    this.fetchResultOnce(this.options.currentId)
  }

  style = {
    zIndex: Number.MAX_SAFE_INTEGER - 10,
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column'
  }

  render() {
    const {results} = this.state
    if (results.length === 0) {
      return null
    }
    return <div style={this.style}>
      <Details results={results} />
      <EntryPoint results={results} />
    </div>
  }
}

render(<MiniProfiler />, document.body)