import React from 'react';
import MaterialTable from 'material-table';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import * as serverfuncs from '../serverfuncs';
import './gallerydropdown.css';

class TradeTable extends React.Component {
  constructor(props) {
    super(props);

    this.rows = [];
    this.read = false;

    this.tradeid = props.identifier;

    this.divid = 'TradeDropdown' + props.identifier;

    this.getRows = this.getRows.bind(this);

    this.raiseTable = this.raiseTable.bind(this);

    this.getRows();
    this.state = {columns: [
      {title: 'Buyer', field: 'buyer'},
      {title: 'Seller', field: 'seller'},
      {title: 'Offer', field: 'offer'},
    ],
    data: this.rows,
    };
  }

  raiseTable() {
    document.getElementById(this.divid).style.top = '-600px';
  }

  async getRows() {
    this.rows = [];
    const trades = await serverfuncs.getTradeDetails();
    for (const trade of trades) {
      if ((trade.archived === 1) && (trade.tradeid === this.tradeid)) {
        this.rows.push(trade);
      }
    }
    this.state.data = this.rows;
    this.read = true;
    this.forceUpdate();
  }

  render() {
    const title = 'Trade Details for ' + this.tradeid;
    return (
      <div id={this.divid} class='tradeTableDropdown'>
        <a class='closebtn' onClick={this.raiseTable}>&times;</a>
        <p>&nbsp;</p>
        {this.read ? (
        <MaterialTable
          title={title}
          columns={this.state.columns}
          data={this.state.data}
          options={{
            rowStyle: {
              'z-index': 3,
            },
          }}
        />
      ) : (<h1>Loading...</h1>)};
      </div>
    );
  }
}

export default class HistoryTable extends React.Component {
  constructor(props) {
    super(props);

    // stuff for memory of table
    this.rows = [];
    this.read = false;

    this.tradetables = [];

    this.getRows = this.getRows.bind(this);

    // needs to be done for divid and other this variables to be preserved
    this.lowerTable = this.lowerTable.bind(this);
    this.raiseTable = this.raiseTable.bind(this);

    this.render = this.render.bind(this);

    this.divid = props.identifier + 'HistoryDropdown';

    this.getRows();
    this.state = {columns: [
      {title: 'Date', field: 'timestamp'},
      {title: 'Buyer', field: 'buyer'},
      {title: 'Seller', field: 'seller'},
      {title: 'Selling Price', field: 'price', type: 'numeric'},
    ],
    data: this.rows,
    };
  }

  lowerTable() {
    document.getElementById(this.divid).style.top = '50px';
  }

  raiseTable() {
    document.getElementById(this.divid).style.top = '-600px';
  }

  async getRows() {
    const history = await serverfuncs.getHistory(this.props.identifier);

    // used in render to print name of artwork rather than the identifier
    this.artwork = await serverfuncs.getArtworkInfo(this.props.identifier);
    this.artworkName = this.artwork.title;

    // converts timestamp to a good string
    for (let i = 0; i < history.length; i++) {
      history[i].timestamp = new Date(history[i].timestamp).toLocaleString();

      // checks if there is a corresponding trade with the trade - if there is, we add a divid to an array
      if (history[i].tradeid !== null) {
        history[i].tradetableid = 'TradeDropdown' + history[i].tradeid;
        this.tradetables.push(history[i].tradeid);
      } else {
        history[i].tradetableid = null;
      }
      this.rows.push(history[i]);
    };
    this.state.data = this.rows;
    this.state.data = this.state.data.sort(function(a, b) {
      return a.timestamp[0] > b.timestamp[0] ? 1 : -1;
    });
    this.read = true;
    this.forceUpdate();
  }

  render() {
    const title = 'Provenance for \'' + this.artworkName + '\'';
    return (
      <div>
        <Button onClick={this.lowerTable}><i>Provenance</i></Button>
        <div id={this.divid} class='galleryDropdown'>
          <a class='closebtn' onClick={this.raiseTable}>&times;</a>
          <p>&nbsp;</p>
          {this.read ? (
          <MaterialTable
            title={title}
            columns={this.state.columns}
            data={this.state.data}
            actions={[
              {
                icon: SearchIcon,
                tooltip: 'Trade Information',
                onClick: (event, rowData) => {
                  if (rowData.tradetableid !== null) {
                    document.getElementById(rowData.tradetableid).style.top = '0px';
                  } else {
                    alert('No trade information found.');
                  }
                },
              },
            ]}
          />
          ) : (<h1>Loading...</h1>)}
          {this.tradetables.map((tradetableid) => (
            <TradeTable identifier={tradetableid} />
          ))}
        </div>
      </div>
    );
  }
}
