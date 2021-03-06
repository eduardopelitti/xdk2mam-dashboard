import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, CssBaseline } from '@material-ui/core'

import Drawer from './Drawer'
import Header from './Header'
import Colors from '../helpers/colors'

/**
 * Layout
 */

class Layout extends PureComponent {
  state = {
    isDrawerOpen: false,
  }

  handleDrawerOpen = () => this.setState({ isDrawerOpen: true })

  handleDrawerClose = () => this.setState({ isDrawerOpen: false })

  render() {
    const { children, classes } = this.props
    const { isDrawerOpen } = this.state

    return (
      <div className={classes.container}>
        <CssBaseline />

        <Drawer open={isDrawerOpen} onClose={this.handleDrawerClose} />

        <Grid classes={{ container: classes.grid }} container>
          <Header onMenuButtonClick={this.handleDrawerOpen} />
          {children}
        </Grid>
      </div>
    )
  }
}

/**
 * PropTypes
 */

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
}

/**
 * Styles
 */

const styles = {
  container: {
    display: 'flex',
    backgroundColor: Colors.FAFAFA,
    height: '100vh',
    alignItems: 'flex-start',
  },

  grid: {
    backgroundColor: Colors.FAFAFA,
  },
}

/**
 * Exports
 */

export default withStyles(styles)(Layout)
