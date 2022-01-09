import React from 'react'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { Button, Grid, InputLabel, TextField, Select, FormControl, MenuItem } from '@mui/material/'
import DateTimePicker from '@mui/lab/DateTimePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import json from './data/data.json'

const columns: GridColDef[] = [{
    field: 'bezeichnung',
    headerName: 'Bezeichnung',
    width: 300
  },
  {
    field: 'art',
    headerName: 'Art',
    width: 300
  },
  {
    field: 'verfuegbar',
    headerName: 'Verfügbarkeit',
    width: 600
  }
]

class Buchungsseite extends React.Component {
  constructor(props) {
    super(props)

    // alle Elemente sind ohne Buchungszeitraum verfügbar
    const rows = [...json.material].map(r => ({...r, verfuegbar: "verfügbar"}))

    this.state = {
      dateVon: null,
      dateBis: null,
      artFilter: null,
      buchbar: false,
      rows,
    }
  }

  convertDateTime = (timestamp) => {
    // timestamp in Datums- und Zeitstring umwandeln
    const date = new Date(timestamp)
    const dateString = ('0' + date.getDate()).slice(-2)+
          "."+('0' + (date.getMonth()+1)).slice(-2)+
          "."+date.getFullYear()+
          " "+('0' + date.getHours()).slice(-2)+
          ":"+('0' + date.getMinutes()).slice(-2)+" Uhr"
    return dateString
  }

  updateRows = () => {
    // Filter anwenden
    let rows = [...json.material]
    const { dateVon, dateBis, artFilter } = this.state
    rows.forEach((row, ridx) => {
      // Arten filtern
      if (!!artFilter) {
        rows = rows.filter((r) => r.art == artFilter)
      }
      // Verfügbarkeit ermitteln und in rows einfügen
      let verfuegbar = true
      let text = "gebucht von "
      row.buchungen.forEach((buchung, buchungidx) => {
        // Ende der neuen Buchung muss vor dem Beginn der bestehenden Buchung
        // oder der Beginn der neuen Buchung nach dem Ende der bestehenden Buchung liegen
        // damit der Termin verfügbar ist
        if (!(buchung.von > dateBis || buchung.bis < dateVon)) {
          verfuegbar = false
          text = text + this.convertDateTime(buchung.von) + " bis " + this.convertDateTime(buchung.bis)
        }
      })
      row.verfuegbar = verfuegbar ? "verfügbar" : text
    })
    this.setState({
      rows
    }, this.checkBuchbar)
  }

  checkBuchbar = () => {
    // Prüft ob Ressource für den gewählten Zeitraum buchbar ist und aktiviert Button
    const {selectedRow, dateVon, dateBis} = this.state
    let buchbar = false
    if (!!selectedRow && !!dateVon && !!dateBis) {
      buchbar = selectedRow.verfuegbar === "verfügbar" && dateVon < dateBis
    }
    this.setState({
      buchbar
    })
  }

  buchen = () => {
    const {selectedRow, dateVon, dateBis} = this.state
    window.alert("Ressource "+selectedRow.bezeichnung+ " von " +this.convertDateTime(dateVon)+" bis "+this.convertDateTime(dateBis)+" gebucht.")
  }

  setDateVon = (newDate) => {
    this.setState({
      dateVon: newDate.getTime()
    }, this.updateRows)
  }

  setDateBis = (newDate) => {
    this.setState({
      dateBis: newDate.getTime()
    }, this.updateRows)
  }

  handleChange = (e) => {
    this.setState({
      artFilter: e.target.value
    }, this.updateRows)
  }

  changeSelected = (o) => {
    this.setState({
      selectedRow: o.row
    }, this.checkBuchbar)
  }

  render() {
    const { rows, dateVon, dateBis, artFilter, buchbar } = this.state
    const displayRows: GridRowsProp = rows
    return (
      <div style={{margin: 20}}>
        <div style={{height: 150, width: '100%'}}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Art</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  value={artFilter}
                  label="Art"
                  onChange={this.handleChange}>
                  <MenuItem value={null}>Nicht filtern</MenuItem>
                  <MenuItem value={'Beamer'}>Beamer</MenuItem>
                  <MenuItem value={'Fahrzeug'}>Fahrzeug</MenuItem>
                  <MenuItem value={'Raum'}>Raum</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <DateTimePicker
                  renderInput={(props) => <TextField required{...props}/>}
                  label="Von"
                  value={dateVon}
                  onChange={(newValue) => {this.setDateVon(newValue)}}
                  ampm={false}
                  minDateTime={Date.now()}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <DateTimePicker
                  renderInput={(props) => <TextField required{...props}/>}
                  label="Bis"
                  value={dateBis}
                  onChange={(newValue) => {this.setDateBis(newValue)}}
                  ampm={false}
                  minDateTime={Date.now()}
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
        <div style={{height: 500, width: '100%'}}>
          <DataGrid rows={displayRows} columns={columns} disableColumnMenu={true} onRowClick={(o) => this.changeSelected(o)}/>
        </div>
        <Button disabled={!buchbar} onClick={this.buchen}>
          Buchen
        </Button>
      </div>
    )
  }
}

export default Buchungsseite
