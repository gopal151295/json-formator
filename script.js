const getTableDatas = (key, val) => {
  let label = `
    <td class="treeLabelCell">
      <span class="treeIcon"></span>
      <span class="treeLabel stringLabel">
        ${key}
      </span>
    </td>
  `
  let isObj = false, isArr = false, isStrNum = false;
  if (Array.isArray(val)) {
    isArr = true
  } else if (!isArr && typeof val === 'object') {
    isObj = true
  } else {
    isStrNum = true
  }
  
  let cls = `objectBox objectBox-${isStrNum ? 'string' : isArr ? 'array' : 'object'}`
  let value = `
    <td class="treeValueCell stringCell">
      <span>
        <span class='${cls}'>
          ${isStrNum ? val : isArr ? '[...]' : '{...}'}
        </span>
      </span>
    </td>
  `
  return label + value
}

const getTableRows = obj => {

  let trs = ''
  Object.keys(obj).map(k => {
    let tds = getTableDatas(k, obj[k])
    let tr = `
      <tr id=${k}>
        ${tds}
      </tr>
    `

    trs += tr
  })

  return trs
}


document.addEventListener("DOMContentLoaded", function (event) {
  fetch('http://localhost:8081/json6.json')
    .then(res => res.json())
    .then(res => {
      console.log('res', res)
      let formated = ``

      let tableRows = getTableRows(res)

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