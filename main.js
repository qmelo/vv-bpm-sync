input = document.getElementById("file")
bpmInput = document.getElementById("bpm")
button = document.getElementById("button")

button.addEventListener("click", function () {
  const file = input.files[0]
  const reader = new FileReader()
  const bpm = bpmInput.value
  reader.onload = function (event) {
    const data = JSON.parse(event.target.result)
    for (let audioItem of Object.values(data.audioItems)) {
      for (let accentPhrase of audioItem.query.accentPhrases) {
        const updateMora = function (mora) {
          let sum = (mora.consonantLength || 0) + (mora.vowelLength || 0)
          let rate = 60 / bpm / 4 / sum

          if (mora.consonantLength) mora.consonantLength *= rate
          if (mora.vowelLength) mora.vowelLength *= rate
        }

        for (let mora of accentPhrase.moras) {
          updateMora(mora)
        }

        if (accentPhrase.pauseMora) {
          updateMora(accentPhrase.pauseMora)
        }
      }
    }
    const blob = new Blob([JSON.stringify(data)], { type: "text/plain" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = file.name
    link.click()
  }
  reader.readAsText(file)
}, false)