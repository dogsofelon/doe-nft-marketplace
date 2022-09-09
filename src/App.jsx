import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import Account from "components/Account";
import NFTBalance from "components/NFTBalance";
import NFTTokenIds from "components/NFTTokenIds";
import { Layout} from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Text from "antd/lib/typography/Text";
import NFTMarketTransactions from "components/NFTMarketTransactions";

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "100px",
    padding: "10px",
  },
  header: {
    backgroundColor: "#2522f1",
    position: "fixed",
    zIndex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    backgroundColor: "#2522f1",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    color: "#2522f1",
    cursor: "pointer",
  },
  nftText: {  
    paddingLeft: "15px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#FFF",
    verticalAlign: "middle"
  },
  logo: {
    display: "inline",
  }
};
const App = () => {

  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100%", width: "100%" }}>
      <Router>
        <Header style={styles.header}>
          <div>
            <NavLink to="/explore">
              <img src="/static/images/icon.png" alt="Dogs Of Elon" width="40" height="40" style={styles.logo}/>
            </NavLink>
            <span style={styles.nftText}>Dogs Of Elon NFT</span>
          </div>
          <div style={styles.headerRight}>
            <NavLink to="/explore"><div style={styles.account}>Explore</div></NavLink>
            <NavLink to="/mynfts"><div style={styles.account}>NFT</div></NavLink>
            <NavLink to="/transactions"><div style={styles.account}>Transactions</div></NavLink>
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/mynfts">
              <NFTBalance />
            </Route>
            <Route path="/explore">
              <NFTTokenIds />
            </Route>
            <Route path="/transactions">
              <NFTMarketTransactions />
            </Route>
          </Switch>
          <Redirect to="/explore" />
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ display: "block" }}>
          <a
            href="https://dogsofelon.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dogs Of Elon
          </a>
        </Text>
      </Footer>
    </Layout>
  );
};

export default App;
