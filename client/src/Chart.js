import React from 'react';
import ReactDOM from 'react-dom';
import c3 from 'c3';
import 'c3/c3.css';

export default class Chart extends React.Component {
 
  async componentDidMount() { 
    const { drizzle, drizzleState } = this.props;
    const sEvent = drizzle.contracts.ScalarEvent;
    const sMarket = drizzle.contracts.StandardMarket;
    const min = await sEvent.methods.lowerBound().call()
    const max = await sEvent.methods.upperBound().call()


    const account = drizzleState.accounts[0]
    const steps = 64
    const xValues = this.generateXValues(min, max, steps)

    xValues.splice(0, 0, 'Dow-Jones')
    const funding = await sMarket.methods.funding().call()
    const yValues = this.generateYValues(min, max, steps, 0,0, funding)
        yValues.splice(0, 0, 'CurrentState')
    const tValues = this.generateYValues(min, max, steps, 0,210000000, funding)
        tValues.splice(0, 0, 'ExpectedPostTrade')

    const tVValues = this.generateYValues(min, max, steps, 21000000,0, funding)
        tVValues.splice(0, 0, 'ExpectedPostTradeV')
    this.chart = c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),
      size: {
        height: 340,
        width: 880
      },
      data: {
        x: 'Dow-Jones',
        columns: [
            xValues,
            yValues,
            tValues,
            tVValues
        ],
        types: {
        CurrentState: 'area-spline' // ADD
      }
      }
    });
  }



  render() {
    return (
      <div ref="chart" algin="center"></div>
    );
  }


  generateYValues(min, max, steps, long, short, liquidityP){
    console.log("los gehts with min", min ,"and max", max)
      var a = []
      var inc = (max-min)/(steps-1)
      var val = Math.abs(min) + Math.abs(inc)
      var currentState = (Math.abs(min) + (Math.abs(max)-min)*(Math.exp(short/liquidityP)/(Math.exp(long/liquidityP)+Math.exp(short/liquidityP))))
  
      var i = 1
      while(val < currentState){
        var q = liquidityP*Math.log((max-min)/(val-min)-1)+short-long
        var c = this.calcCost(short, long + q, liquidityP)- this.calcCost(short,long, liquidityP)
        val+= inc
        a[i]=c
        i++
      }
      while(i< steps-1){
        q = liquidityP*Math.log((val-min)/(max-val))+long -short
        c = this.calcCost(short + q, long, liquidityP)- this.calcCost(short,long, liquidityP)
        val+= inc
        a[i]=c
        i++
      }
      a[i]=a[i-1]+a[i-1]-a[i-2]
      a[0]=a[1]+a[1]-a[2]
      return a;
    }

 generateXValues(min, max, steps){
      var a = []
      var inc = (max-min)/(steps-1)
      for(var i=0;i<steps;i++){
        a[i] = Math.abs(min)+ inc*i
      }
      return a;
  }

  calcCost(p, q, l){
      return l*(Math.log(Math.exp(p/l)+Math.exp(q/l))-Math.log(2))
    }

}