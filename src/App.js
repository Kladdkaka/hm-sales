import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link, useParams
} from "react-router-dom";
import styled, {css} from 'styled-components/macro'

export default function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/about">
                        <About/>
                    </Route>
                    <Route path="/country/:countryId" children={<Country/>}/>
                    <Route path="/store/:storeCode" children={<Store/>}/>

                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("https://api.storelocator.hmgroup.tech/v2/brand/hm/locations/locale/sv_se/countries")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result.storeCountries);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <ul>
                {items.map(item => (
                    <li key={item.countryId}>
                        <Link to={`/country/${item.countryId}`}>{item.name} ({item.countryId})</Link>
                    </li>
                ))}
            </ul>
        );
    }

}

function About() {
    return <h2>About</h2>;
}

function Country() {
    let {countryId} = useParams();

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(`https://api.storelocator.hmgroup.tech/v2/brand/hm/stores/locale/sv_se/country/${countryId}?_type=json&campaigns=true&departments=true&openinghours=true&maxnumberofstores=100`)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result.stores);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <ul>
                {items.map(item => (
                    <li key={item.storeCode}>
                        City: {item.city}<br/>
                        Name: {item.name}<br/>
                        Store Code: <Link to={`/store/${item.storeCode}`}>{item.storeCode}</Link>
                    </li>
                ))}
            </ul>
        );
    }
}

const ItemArticle = styled.article`
    
`
const ImageContainer = styled.div`
    position: relative;
`

const ProductImage = styled.img`
    height: auto;
    position: relative;
    width: 100%;
`

const ItemDetails = styled.div`
    box-sizing: border-box;
    position: relative;
    text-align: left;
    z-index: 1;
`
const ItemHeading = styled.h3`
    margin: 0;
`
const ItemPrice = styled.strong`
    display: block;
    margin: 2px 0 0;
    margin-top: 0;
`

const ItemPriceSale = styled.span`
    color: #c9002e;
    display: inline;
    font-weight: normal;
    font-size: 13px;
    letter-spacing: 0px;
    line-height: 20px;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
`

const ItemPriceRegular = styled.span`
    color: #222;
    font-size: 11px;
    line-height: 20px;
    margin: 0 0 0 5px;
    text-decoration: line-through;
    vertical-align: bottom;
    display: inline;
    font-weight: normal;
    letter-spacing: 0px;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
`


function Item(props) {
    return <ItemArticle>
        <ImageContainer>
            <a href={'https://www2.hm.com' + props.item.linkPdp}>
                <ProductImage src={props.item.images[0].url}/>
            </a>
        </ImageContainer>
        <ItemDetails>
            <ItemHeading>
                <a href={'https://www2.hm.com' + props.item.linkPdp}>{props.item.name}</a>
            </ItemHeading>
            <ItemPrice>
                <ItemPriceSale>{props.item.price.formattedValue}</ItemPriceSale>
                <ItemPriceRegular>{props.item.whitePrice.formattedValue}</ItemPriceRegular>
            </ItemPrice>
        </ItemDetails>
    </ItemArticle>;
}

/*

function Item(props) {
    return <li>
        Name: {props.item.name}<br/>
        Original: {props.item.whitePrice.formattedValue}<br/>
        Price: <span style={{color: "red"}}>{props.item.price.formattedValue}</span><br/>
        Stock: {props.item.stock.stockLevel}<br/>
        <img src={props.item.images[0].url}/>
    </li>;
}
 */

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    margin: 0 15% 0 15%;
`

function Store() {
    let {storeCode} = useParams();

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0)

    useEffect(() => {
        let query = ':stock:category:men_all:sale:true'; //`sale:true`;
        let pageSize = `40`;
        setIsLoaded(false)
        fetch(`http://localhost:4000/hmwebservices/service/products/search/hm-sweden/Online/sv?q=${query}&retailStoreId=${storeCode}&pageSize=${pageSize}&currentPage=${page}`, {
            headers: {
                'Target-URL': `https://app2.hm.com/`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result.results);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [page])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else {
        return (
            <>
                <button onClick={() => setPage(page - 1)}>Back</button>
                <button>Current: {page}</button>
                <button onClick={() => setPage(page + 1)}>Next</button>

                {
                    !isLoaded
                        ? <div>Loading...</div>
                        : <Wrapper>
                            {items.filter(item => !['DAM', 'BARN', 'HEM', 'HOME'].includes(item.categoryName)).map(item => (
                                <Item key={item.storeCode} item={item}/>
                            ))}
                        </Wrapper>
                }

            </>
        );
    }
}

//item.stock.stockLevel !== 1 &&