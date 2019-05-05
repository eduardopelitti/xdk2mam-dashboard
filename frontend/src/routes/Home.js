import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Paper, Grid, Typography } from '@material-ui/core'

import Colors from '../helpers/colors.js'
import { formatWeatherData } from '../helpers/utils.js'
import data from '../helpers/data.js'
import Layout from '../components/Layout'
import LineChart from '../components/LineChart'

/**
 * Home
 */

class Home extends Component {
  state = {
    infoSensor: null,
    selectedTab: 0,
  }

  componentDidMount() {
    this.setState({ infoSensor: formatWeatherData(data) })
  }

  getEnvironmentInfo = () => {
    const { infoSensor } = this.state

    if (!infoSensor || infoSensor.length < 0) {
      return null
    }

    return infoSensor.map(info => {
      if (info.xdk2mam[0].sensorType !== 'Environmental') {
        return null
      }

      return (
        <div>
          <h4 key={`${info.timestamp}`}>
            Pressure: {info.xdk2mam[0].data[0].value} - Temperature: {info.xdk2mam[0].data[1].value} - Humidity:{' '}
            {info.xdk2mam[0].data[2].value} - Device: {info.device} - Timestamp: {info.timestamp}
          </h4>
        </div>
      )
    })
  }

  handleTabChange = (event, value) => this.setState({ selectedTab: value })

  render() {
    const { classes } = this.props
    const { selectedTab } = this.state
    const weatherData = this.state.infoSensor

    const colorPalette = [Colors.LOGO_GREEN, Colors.DARKEST_BLUE, Colors.COMP_YELLOW]

    return (
      <Layout>
        <Grid item xs={12}>
          <Tabs
            value={selectedTab}
            onChange={this.handleTabChange}
            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          >
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Weather" />
            <Tab
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label="Environmental"
            />
            <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Inertial" />
          </Tabs>
        </Grid>
        {selectedTab === 0 && (
          <Grid container spacing={12} className={classes.baseGrid}>
            {weatherData &&
              weatherData.map((data, index) => (
                <Grid item sm={4} xs={12} key={index} className={classes.gridInner}>
                  <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={0}>
                      <Typography variant="subheading" color="inherit">
                        {data.sensorName}
                      </Typography>
                      <LineChart data={data.data} color={colorPalette[index]} />
                    </Paper>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        )}
      </Layout>
    )
  }
}

/**
 * PropTypes
 */

Home.propTypes = {
  classes: PropTypes.object.isRequired,
}

/**
 * Styles
 */

const styles = {
  tabsRoot: {
    borderBottom: `1px solid ${Colors.WHITE}`,
  },
  tabsIndicator: {
    backgroundColor: Colors.COMP_YELLOW,
  },
  tabRoot: {
    color: Colors.WHITE,
    textTransform: 'initial',
    minWidth: 72,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: Colors.WHITE,
      opacity: 1,
    },
    '&$tabSelected': {
      color: Colors.WHITE,
    },
    '&:focus': {
      color: Colors.WHITE,
    },
  },
  tabSelected: {},
  baseGrid: {
    backgroundColor: Colors.FAFAFA,
  },
  gridInner: {
    padding: '1%',
  },
  paper: {
    padding: 10,
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
}

/**
 * Exports
 */

export default withStyles(styles)(Home)
