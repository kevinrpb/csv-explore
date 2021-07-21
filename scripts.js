let data = []

let dropArea, fileName
let errorSection, errorMessage, dataSection
let table, searchValue

let listTable

function init() {
  dropArea = document.getElementById('drop-area')
  fileName = document.getElementById('file-name')

  errorSection = document.getElementById('errors')
  errorMessage = document.getElementById('error-message')
  dataSection = document.getElementById('data-explore')

  table = document.getElementById('data-table')
  searchValue = document.getElementById('search-value')

  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })

  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })

  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

  dropArea.addEventListener('drop', handleDrop, false)
}

function preventDefaults(event) {
  event.preventDefault()
  event.stopPropagation()
}

function highlight() {
  dropArea.classList.add('highlight')
}

function unhighlight() {
  dropArea.classList.remove('highlight')
}

function handleDrop(event) {
  const files = event.dataTransfer.files

  handleFiles(files)
}

function handleFiles(files) {
  errorSection.classList.remove('show')
  dataSection.classList.remove('show')

  const file = files[0]

  fileName.innerHTML = file.name

  Papa.parse(file, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
    complete: handleParseComplete,
    error: handleParseError
  })
}

function handleParseComplete(result) {
  if (result.errors.length > 0) {
    handleParseError(result)
    return
  }

  data = result.data
  updateTable()

  dataSection.classList.add('show')
}

function handleParseError(result) {
  const error = result.errors[0]

  errorMessage.innerHTML = `Error on row ${error.row}: ${error.message}`

  errorSection.classList.add('show')
  console.error(result)
}

function updateTable() {
  function thead(item) {
    let template = ''

    for (let key in item) {
      template += `<th scope="col">${key}</th>`
    }

    template = `<thead><tr>${template}</tr></thead><tbody class="list"></tbody>`

    return template
  }

  function itemTemplate(item) {
    let template = ''

    for (let key in item) {
      template += `<td class="${key}"></td>`
    }

    template = `<tr>${template}</tr>`

    return template
  }

  if (listTable) listTable.clear()

  const options = {
    valueNames: Object.keys(data[0]),
    item: itemTemplate(data[0])
  }

  table.innerHTML = thead(data[0])

  listTable = new List(dataSection, options, data)
}
