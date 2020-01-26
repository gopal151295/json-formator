const getType = v => {
  let type = {
    isNull: false,
    isUndef: false,
    isObj: false,
    isArr: false,
    isStrNum: false
  };

  if (typeof v === 'undefined') {
    type.isUndef = true
  } else if (v === null) {
    type.isNull = true
  } else if (Array.isArray(v)) {
    type.isArr = true
  } else if (!type.isArr && typeof v === 'object') {
    type.isObj = true
  } else {
    type.isStrNum = true
  }

  return type;
}

const currState = {};

const getTableDatas = (key, val, isCollapsed, type) => {
  const {
    isNull = false,
    isUndef = false,
    isArr = false,
    isStrNum = false,
    isObj = false
  } = {} = type;

  let isPrimitive = isStrNum || isNull || isUndef;

  let label = `
    <td class="treeLabelCell">
      <span class="treeIcon">${!isPrimitive ? isCollapsed ? '+' : '-' : ''}</span>
      <span class="treeLabel stringLabel">
        ${key}
      </span>
    </td>
  `
  let objCls = `objectBox objectBox-${isPrimitive ? 'string' : isArr ? 'array' : 'object'}`
  let cellCls = `treeValueCell ${isPrimitive ? 'string' : isArr ? 'array' : 'object'}Cell`
  let objChld = `
    <span class='${cellCls}'>
      ${isPrimitive ? val : isArr ? '[...]' : '{...}'}
    </span>
  `

  let value = `
    <td class='${objCls}'>
      <span>
        ${(isPrimitive || isCollapsed) ? objChld : ''}
      </span>
    </td>
  `
  return label + value
}

const getTableRows = (data, pKey, hasKeys) => {

  let trs = ''

  hasKeys && Object.keys(data).map(k => {
    let v = data[k]
    const type = {} = getType(v)
    const {
      isNull = false,
      isUndef = false,
      isObj = false,
      isArr = false,
      isStrNum = false
    } = type;

    let isPrimitive = isStrNum || isNull || isUndef;
    let isCollapsed = false

    let tds = getTableDatas(k, v, isCollapsed, type)

    let keyId = k.replace(/\\/g, "\\\\"); // every \ -> \\
    keyId = keyId.replace(/\//g, "\\/");  // every / -> \/

    let id = `${pKey === '/' ? '' : pKey}/${keyId}`

    currState[id] = true;

    let rowCls = `${isStrNum ? 'string' : isArr ? 'array' : 'object'}Row`
    let childCls = `${v ? (isObj || isArr) ? 'hasChildren' : '' : ''}`
    let collapsedCls = `${isCollapsed ? 'collapsed' : 'expanded'}`

    let cls = `treeRow ${rowCls} ${childCls} ${collapsedCls}`

    let tr = `
      <tr id='${id}' class='${cls}'>
        ${tds}
      </tr>
    `
    let trChild = v ? getTableRows(v, id, !isPrimitive) : ''
    tr += trChild

    trs += tr
  })

  return trs
}


document.addEventListener("DOMContentLoaded", function (event) {
  fetch('http://localhost:8081/json0.json')
    .then(res => res.json())
    .then(res => {
      console.log('res', res)
      let formated = ``

      let tableRows = getTableRows(res, '/', true)

      formated = tableRows

      let main = `
      <div id='table_wrapper'>
        <table id='main_table'>
          <thead></thead>
          <tbody>
            ${formated}
          </tbody>
        </table>
      </div>`
      let mainDiv = document.getElementById("main")
      mainDiv.innerHTML = main
    })
});