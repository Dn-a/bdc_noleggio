import React from 'react';

const StoreContext = React.createContext();

const createStore = WrappedComponent => {
    return class extends React.Component {

        state = {
            get: (keys) => {
                if(keys.length==2 )
                    return this.state[keys[0]][keys[1]]
                else if(keys.length==1)
                    return this.state[keys[0]]
                else
                    console.log("Store: no key1 and key2");
            },
            set: (keys, value) => {
                const state = this.state
                if(keys.length==2)
                    state[keys[0]][keys[1]] = value
                else if(keys.length==1)
                    state[keys[0]] = value
                else
                    console.log("Store: no key1 and key2");
                return new Promise((resolve) => this.setState(state, () => resolve()));
                //return this.setState(state)
            },
            /*remove: key => {
            const state = this.state
            delete state[key]
            this.setState(state)
            }*/
        }

        render() {
            return (
            <StoreContext.Provider value={this.state}>
                <WrappedComponent {...this.props} />
            </StoreContext.Provider>
            )
        }
    }
}

const withStore = WrappedComponent => {
    return class extends React.Component {
        render() {
            return (
                <StoreContext.Consumer>
                    {context => <WrappedComponent store={context} {...this.props} />}
                </StoreContext.Consumer>
            )
        }
    }
}
    
export { createStore, withStore }