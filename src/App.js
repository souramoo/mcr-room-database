import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron
} from "reactstrap";

import LoadingOverlay from "react-loading-overlay";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Input from '@material-ui/core/Input';

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Rating from 'material-ui-rating';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import wheel from "./img/wheel.png";
import "font-awesome/css/font-awesome.min.css";
import "react-image-gallery/styles/css/image-gallery.css";

import ImageGallery from 'react-image-gallery';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { connect } from 'react-redux'


const { Star, StarBorder } = require('@material-ui/icons');
const green = require('@material-ui/core/colors/orange').default;
const grey = require('@material-ui/core/colors/grey').default;


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const rootReducer = (state = {h2: "", places: [ 
   {
      name: "Loading...",
      mainTitle: "The largest off-site graduate accomodation block.",
      desc: "With 68 rooms and 10 kitchens, most MCR members live here. All rooms come with an en-suite. This place has a strong sense of community, with a feeling of student halls and bedders every week to keep your rooms tidy. Half of the site was refurbished a few years back, and so rooms vary from modern to the old.",
      address: "-",
      position: [0, 0],
      id: "russell-st",
      pictures: [
          'assets/russell-st/1.jpg'
      ],
      rep: "mcr.accomodation@caths.cam.ac.uk",
      floorplan: "assets/russell-st/floorplan.pdf",
      reviews: [  ],
      roomTypes: [ 
      ]
    }
  ], loggedIn: false}, action) => {
  switch (action.type) {
    case 'SET_H2':
      return {
        ...state,
        h2: action.title
      }
    case 'SET_LOGGEDIN':
      return {
        ...state,
        loggedIn: action.loggedIn,
        myName: action.myName,
        crsid: action.crsid
      }
    case 'SET_PLACES':
      return {
        ...state,
        places: action.places
      }
    case 'SET_LOCATIONS':
      var s = state;
      for(var o in s.places) {
          s.places[o].position = action.position[o];
      }
      return s
    case 'ADD_REVIEW':
      var s = state;
      for(var o in s.places) {
          if(s.places[o].id == action.place) {
              s.places[o].reviews.unshift({ stars: action.stars, personCrsid: s.crsid, person: s.myName, text: action.text});
          }
      }
      return s
    default:
      return state
  }
}
const store = createStore(rootReducer)


export class Home extends Component {

    constructor(props) {
        super(props);

    this.state = {
    };
    }

    render() {
this.props.dispatch({type: "SET_H2", title: ""})
        return (
<Row>
<Col md="4">

<Typography variant="h5" component="h3">
Select a place below for more:</Typography>
<List>
{this.props.places.map((item, i) => (
<div>
      <ListItem alignItems="flex-start" button component={props => <Link to={`/${item.id}`} {...props} />}>
        <ListItemAvatar>
          <Avatar alt={item.name} src={item.pictures[0]} />
        </ListItemAvatar>
        <ListItemText
          primary={item.name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"

                color="textPrimary"
              >
                {item.address}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>

      { i < this.props.places.length - 1 ? <Divider variant="inset" component="li" /> : '' }
</div>
))}
    </List>
</Col><Col>
<Typography variant="h5" component="h3">
Map:</Typography><br />
               <Map center={[52.2053, 0.1218]} zoom={13} minZoom={12} maxZoom={17} style={{width: "100%", height: "500px"}}>
    <TileLayer
      url="https://a.tile.openstreetmap.org/${z}/${x}/${y}.png"
      attribution=""
    />
{this.props.places.map(item => (

    <Marker position={item.position}>
      <Popup><h4>{item.name}</h4>
              <Link to={`/${item.id}`}>Read more...</Link>
      </Popup>
    </Marker>


))}

  </Map>
</Col>
</Row>
        );
    }
}

export class Accomodation extends Component {

    constructor(props) {
        super(props);

    this.state = {
      places: this.props.places, isOpen: false, imageShow: [], photoIndex: 0
    };
    }

    render() {

var item = null;
for(var i2 of this.props.places){
if(""+i2.id == this.props.match.params.id) {item = i2; break;}
}

if(item == null) {
this.props.dispatch({type: "SET_H2", title: "Error"})
return (
  <div>
     <h3>Unknown accomodation.</h3>
<p>Please go back and try something else...</p>
  </div>
);
}

var minPrice = 9, maxPrice = 0;
for(var o of item.roomTypes){
if(o.price.length < minPrice) minPrice = o.price.length;
if(o.price.length > maxPrice) maxPrice = o.price.length;
}
var minPriceT="",maxPriceT="";
for(var i =0;i<minPrice;i++){ minPriceT += "£" }
for(var i =0;i<maxPrice;i++){ maxPriceT += "£" }
var priceT = minPriceT + " - " + maxPriceT
if(minPrice == maxPrice) priceT = minPriceT;

var allPics = []
for(var o of item.pictures) {
allPics.push({original: o, thumbnail: o})
}
for(var o of item.roomTypes) {
for(var oo of o.images){
allPics.push({original: oo, thumbnail: oo})
}
}

this.props.dispatch({type: "SET_H2", title: item.name})

        return (
<div>
<Row>
<Col md="8">
<Paper>
     <ImageGallery items={allPics} />
</Paper>
<br />
<Paper style={{ padding: "20px 50px" }}>
        <Typography variant="h5" component="h3">
          {item.mainTitle}
        </Typography>
        <Typography component="p" style={{marginTop: "7px"}}>
                    {item.desc}        </Typography>
      </Paper>


<Row><Col>
<br />
{item.roomTypes.length > 0 ? (
        <Typography variant="h6" component="h4">
          Room types available here:
        </Typography>
):''}
<br />
<Row>
{item.roomTypes.map(room => (   
<Col md="4">
<Card style={{marginBottom: "17px"}}>
      <CardActionArea onClick={() => this.setState({ isOpen: true, imageShow: room.images, photoIndex: 0 })}>
        <CardMedia
          image={room.images[0]}
          title={room.name} style={{height: "180px"}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {room.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {room.desc}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Typography size="small" color="primary" style={{padding: "10px"}}>
          {room.price}
        </Typography>
        <Button size="small" color="primary" onClick={() => this.setState({ isOpen: true, imageShow: room.images, photoIndex: 0 })}>
          Learn More
        </Button>
      </CardActions>
    </Card>
</Col>
))}
</Row>
</Col>
</Row>

</Col>

<Col md="4">
<Paper style={{ padding: "20px 50px" }}>
               <Map center={item.position} zoom={15} minZoom={15} maxZoom={15} zoomControl={false} style={{width: "100%", height: "200px"}}>
    <TileLayer
      url="https://a.tile.openstreetmap.org/${z}/${x}/${y}.png"
      attribution=""
    />
    <Marker position={item.position}>
      <Popup><h4>{item.name}</h4>
              {item.address}
      </Popup>
    </Marker>
  </Map>


<br />
        <Typography variant="h5" component="h3">
Address:</Typography>
{item.address}

<br /><br />

{priceT.length < 9 ? (
<React.Fragment>
<Typography variant="h5" component="h3">
Price Range:</Typography>
<p>{ priceT }</p>
</React.Fragment>
):''}
          <Button component={props => <a href={item.floorplan} {...props} /> } ><i class="fa fa-map" style={{ display: "inline-block", margin: "0 7px" }}></i> See floor plans</Button><br />
          <Button component={props => <a href={`https://www.google.com/maps/dir/?api=1&destination=` + encodeURIComponent(item.address)} {...props} /> } ><i class="fa fa-location-arrow" style={{ display: "inline-block", margin: "0 7px" }}></i> Get Directions</Button><br />
          <Button component={props => <a href={`mailto:` + item.rep} {...props} /> } ><i class="fa fa-envelope"  style={{ display: "inline-block", margin: "0 7px" }}></i> Contact representative</Button>


      </Paper>

<br />
<Paper style={{ padding: "20px 10px" }}>
               
        <Typography variant="h5" component="h5" style={{padding: "0 40px"}}>
Recent reviews:
        </Typography>

<List>

{item.reviews.map((review, i) => (

<div>

      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={review.person} src={`https://mcr.caths.cam.ac.uk/api/pic/${review.personCrsid}`} />
        </ListItemAvatar>
        <ListItemText
          primary={
<React.Fragment>
<center>
{review.person}
</center>
</React.Fragment>
}
          secondary={
            <React.Fragment>
<center>
<Rating

      iconFilled={<Star htmlColor={green[500]} />}
      iconHovered={<StarBorder htmlColor={grey[300]} />}
      iconNormal={<StarBorder htmlColor={grey[300]} />}
  value={review.stars}
  readOnly={true}
/>
</center>

              <Typography
                component="span"
                variant="body2"
style={{textAlign: "justify"}}
                color="textPrimary"
              >
                {review.text}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      { i < item.reviews.length - 1 ? <Divider variant="inset" component="li" /> : '' }
</div>

     
))}

    </List>
      </Paper><br />

{ this.props.loggedIn ? (

<Paper style={{ padding: "20px 10px" }}>
        <Typography variant="h5" component="h5" style={{padding: "0 40px"}}>
Add a review:
        </Typography>

      <ListItem alignItems="flex-start">

        <ListItemAvatar>
          <Avatar alt={this.props.myName} src={`https://mcr.caths.cam.ac.uk/api/pic/${this.props.crsid}`} />
        </ListItemAvatar>
        <ListItemText
          primary={
<React.Fragment>
<center>
{this.props.myName}
</center>
</React.Fragment>
}
          secondary={
            <React.Fragment>
<center>
<Rating  value={this.state.rating} 
  onChange={ (value) => {this.setState({rating: value})} }
/>

              <Typography
                component="span"
                variant="body2"
style={{textAlign: "justify"}}
                color="textPrimary"
              >
                <Input 
        id="standard-textarea"
        label="Write a review below!"
        placeholder="Enter text here..."
        multiline onChange={(value) => {this.setState({text:	 value.target.value})}} value={this.state.text}
        margin="normal" />
              </Typography>

<br /><br />
<Button variant="contained" color="primary"  onClick={ ()=> { if(this.state.stars > 0 || this.state.text != "") {fetch(API + "/add_review", {
  method: 'POST', credentials: 'include',
  body: JSON.stringify({stars: ""+this.state.rating, text: this.state.text, place: this.props.match.params.id}),
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.then(response => {console.log('Success:', JSON.stringify(response));  
this.props.dispatch({type: "ADD_REVIEW", stars: ""+this.state.rating, text: this.state.text, place: this.props.match.params.id}); this.setState({rating: 0, text: '' })   })
.catch(error => console.error('Error:', error));} }  }><i class="fa fa-send"></i>&nbsp;&nbsp;Submit!</Button>
</center>
            </React.Fragment>
          }
        />
      </ListItem>

      </Paper>
) : ''}

</Col>

</Row>

{this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.imageShow[this.state.photoIndex]}
            nextSrc={this.state.imageShow[(this.state.photoIndex + 1) % this.state.imageShow.length]}
            prevSrc={this.state.imageShow[(this.state.photoIndex + this.state.imageShow.length - 1) % this.state.imageShow.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (this.state.photoIndex + this.state.imageShow.length - 1) % this.state.imageShow.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (this.state.photoIndex + 1) % this.state.imageShow.length,
              })
            }
          />
        )}

</div>
        );
    }
}


const API = "/api";


export class Base extends Component {
  constructor(props) {
    super(props);
    this.calRef = React.createRef();
this.state= {loading: true}
  }


  async componentDidMount(){
      var dat = await fetch(API + "/accom_list")
      var data = await dat.json()

      console.log(data)
      this.props.dispatch({type: "SET_LOGGEDIN", loggedIn: data.isLoggedIn, myName: data.myName, crsid: data.crsid})
      this.props.dispatch({type: "SET_PLACES", places: data.places})

      var places = []
      for(var o of data.places) {
          var loc = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(o.address)+'&key=AIzaSyDQyz5iLsAsXz07bmXYl2bUoAJFrNKPFGk');
          var lJson = await loc.json();
          places.push([lJson.results[0].geometry.location.lat, lJson.results[0].geometry.location.lng])
      }
        
      this.props.dispatch({type: "SET_LOCATIONS", position: places})

      this.setState(
        {
          loggedIn: data.isLoggedIn, name: data.myName, loading: false
        }
      );
  }


  render() {
    return (
        <Router>
          <LoadingOverlay
            active={this.state.loading}
            spinner
            text="Working on it..."
          >
            <Navbar expand="md" style={{ background: "#8e2420" }}>
              <Container>
                <Row style={{ width: "100%", height: "40px" }} className="navbartop">
                  <Col>
                    <NavbarBrand href="https://mcr.caths.cam.ac.uk">
                      <img src={wheel} />
                    </NavbarBrand>
                  </Col>
                  <Col>                  </Col>
                </Row>
              </Container>
            </Navbar>
            <Jumbotron
              style={{
                background: "#a62a25",
                color: "white",
                borderRadius: "0"
              }}
            >
              <Container>
                <Row>
                  <Col>
                    <h1 style={{textAlign: "center"}}>Graduate Accomodation Database</h1>
                  </Col>
                </Row><br />
<Row>
{ ( this.state.loggedIn ? (
<React.Fragment>
<Col md="8"></Col>
<Col md="4" style={{ textAlign: "right" }}>
Welcome back, {this.state.name} <br />
<Button style={{color: "white"}} component={props => <a style={{display:"inline-block"}} href={`/logout/rooms${window.location.hash}`} {...props} /> }>Logout</Button>
</Col>
</React.Fragment>
) : (
<React.Fragment>
<Col md="11"></Col>
<Col md="1" style={{ textAlign: "right" }}>
<Button style={{color: "white"}} component={props => <a href={`/login/rooms${window.location.hash}`} {...props} /> }>Login</Button>
</Col>
</React.Fragment>
) )}
</Row>
<Row>

{this.props.h2 != "" ? (
<Button component={props => <Link to={`/`} {...props} /> } style={{ color: "white", float: "left", margin: "3px 10px" }}><i className="fa fa-arrow-left" /></Button>
) : '' }
        <Typography variant="h5" component="h3">
{this.props.h2}</Typography>
</Row>
              </Container>
            </Jumbotron>
            <Container>
    		<Route exact path="/" component={HomeConnected}/>
    		<Route path="/:id" component={AccomodationConnected}/>
            </Container>
            <div className="ftr">
              Made with <span class="fa fa-heart" /> by{" "}
              <a href="https://github.com/moosd">souradip</a>.
            </div>
          </LoadingOverlay>
        </Router>
    );
  }
}



const HomeConnected = connect((state) => state)(Home)
const AccomodationConnected = connect((state) => state)(Accomodation)
const BaseConnected = connect((state) => state)(Base)


export class App extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
  <Provider store={store}>
        <BaseConnected />
      </Provider>
    );
  }
}

export default App;
