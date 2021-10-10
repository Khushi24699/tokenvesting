import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import { getTokenVesting, getTToken } from '../contracts'

import Header from './Header'
import Vesting from './Vesting'




class TokenVestingUi extends Component {
  constructor() {
    super()
    this.state = { name: 'Token', loading: true }
  }

  componentDidMount() {
    this.getData()
  }

  render() {
    const { address, token } = this.props
    return (
      <div className="TokenVestingUi">

        { this.state.loading ? <Spinner /> : null }

        <Header address={ address } token={ token } tokenName={ this.state.name } />

        <Grid>
          <Row>
            <Col xs={12} md={6}>
              <VestingDetails
                address={ address }
                token={ token }
                details={ this.state }
                getData={ () => this.getData() }
                setLoader={ x => this.setLoader(x) }
              />
            </Col>

            <Col xs={12} md={6}>
              <VestingSchedule details={ this.state } />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }

  setLoader(loading) {
    this.setState({ loading })
  }

  async getData() {
    const { address, token } = this.props

    const tokenVesting = await getTokenVesting(address)
    const tokenContract = await getTToken(token)

    const start = await tokenVesting.start()
    const duration = await tokenVesting.duration()
    const end = start.plus(duration)

    const balance  = await tokenContract.balanceOf(address)
    const released = await tokenVesting.released(token)
        this.setState({
      start,
      end,
     
      total,
      released,
      vested: await tokenVesting.vestedAmount(token),
      decimals: await tokenContract.decimals(),
      beneficiary: await tokenVesting.beneficiary(),
      owner: await tokenVesting.owner(),
      revocable: await tokenVesting.revocable(),
      
      name: await tokenContract.name(),
      symbol: await tokenContract.symbol(),
      loading: false
    })
  }
}


export default TokenVestingUi
