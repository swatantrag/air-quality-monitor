import React from 'react';

class FriendList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            list: [],
            originalList: [],
            name: '',
            isValid: false,
            isSearch: false,
            search: '',
            isModal: false,
            deleteFriend: '',
            currentPage: 1,
            pageLimit: 4,
            pages: 0,
            first: true, 
            prev: true,
            next: false,
            last: false
        }
    }

    handleInputChange = event => {
        this.setState({ name: event.target.value, isValid: false });
    }

    handleKeyPress = event => {
        if (event.code === 'Enter') {
            if (this.validateName()) {
                let arr = this.state.originalList;
                arr.push({
                    'name': this.state.name.trim(),
                    'favorite': false
                });
                let list = arr.filter( (ele, ind) => ind === arr.findIndex( elem => elem.name === ele.name));
                this.setState({ name: '', isValid: false, pages: Math.trunc((this.state.originalList.length  - 1) / this.state.pageLimit) + 1 }, () => {
                    this.handlePaginationList(list);
                    this.handlePagi(null);
                });
            } else {
                this.setState({ isValid: true });
            }
        }
    } 

    validateName = () => {
        const regex = new RegExp(/^[a-zA-Z ]*$/);
        return regex.test(this.state.name);
    }

    handleSearch = event => {
        const search = event.target.value.toLowerCase();
        let list = [];  
        for ( let i = 0; i < this.state.originalList.length; i++) {
            if (this.state.originalList[i].name.toLowerCase().includes(search)) {
                list.push(this.state.originalList[i]);
            }
        }
        this.setState({ list, name: '', isValid: false, search, pages: Math.trunc((this.state.originalList.length  - 1) / this.state.pageLimit) + 1  });
    }

    handleFliter = () => {
        let list = this.state.originalList.sort((x,y) => x.favorite - y.favorite);        
        this.setState({ list: list.reverse(), originalList: list}, () => {
            this.handlePagi(null);
        });
    }

    handleFavorite = friend => {  
        let list = this.state.list.map(el => (
            el.name === friend.name ? {...el, favorite: !friend.favorite } : el
        ))
        this.setState({ list, originalList: list });
    }

    handleDelete = friend => {
        this.setState({ isModal: true, deleteFriend: friend }, () => {
            this.handlePagi(null);
        });
    }

    submitDelete = () => {
        const list = this.state.originalList.filter((item) => item.name.toLowerCase() !== this.state.deleteFriend.name.toLowerCase());
        this.setState({ list, originalList: list, isModal: false }, () => {
            this.handlePaginationList(list);
        });
    }

    handlePagi = type => {
        const pages = this.state.pages;
        let currentPage = this.state.currentPage;
        let first = false;
        let prev = false;
        let next = false;
        let last = false;
        if (type === 'first') {
            currentPage = 1;
            first = true;
            prev = true;
            next = pages < 2;
            last = pages < 2;
        } else if (type === 'prev') {
            currentPage -= 1;
            first = currentPage < 2;
            prev = currentPage < 2;
            next = pages < currentPage;
            last = pages < currentPage;
        } else if (type === 'next') {
            currentPage += 1;
            first = false;
            prev = false;
            next = pages <= currentPage;
            last = pages <= currentPage;
        } else if (type === 'last') {
            currentPage = pages;
            first = false;
            prev = false;
            next = pages <= currentPage;
            last = pages <= currentPage;
        } else {
            currentPage = pages < currentPage ? currentPage -1 : currentPage;
            first = currentPage < 2;
            prev = currentPage < 2;
            next = pages <= currentPage;
            last = pages <= currentPage;
        }
        this.setState({ currentPage, first, prev, next, last, search: ''}, () => {
            if (type !== null)
            this.handlePaginationList(this.state.originalList);
        });
    } 

    handlePaginationList = list => {
        const pageLimit = this.state.pageLimit;
        const currentPage = this.state.currentPage;
        let newList = [];
        for (let i = pageLimit * (currentPage - 1); i < (this.state.pageLimit * currentPage); i++ ) {
            if (list.length > i) newList.push(list[i]);
        }
        this.setState({ list: newList, originalList: list, pages: Math.trunc(this.state.list.length / this.state.pageLimit) + 1 });
    }

    render() {
        return (
            <div className="wrap">
            <h3>Friends List</h3>
                <div className="header">
                    <div className="text-box">
                        <div className={`input name${!this.state.isSearch ? ' selected' : ''}`}>
                            <input 
                                type="text"
                                placeholder="Enter your friend's name"
                                value={this.state.name}
                                id="name"
                                onKeyPress={this.handleKeyPress}
                                onChange={this.handleInputChange}
                            />
                            <span onClick={() => this.setState({ isSearch: true, list: this.state.originalList })}>
                                <i className="fa fa-search"></i>
                            </span>
                        </div>
                        <div className={`input search${this.state.isSearch ? ' selected' : ''}`}>
                            <span onClick={() => this.setState({ isSearch: false, search: '' }, () => this.handlePaginationList(this.state.originalList))}>
                                <i className="fa fa-plus"></i>
                            </span>
                            <input 
                                type="text"
                                placeholder="Search friend's name"
                                value={this.state.search}
                                id="search"
                                onChange={this.handleSearch}
                            />
                        </div>
                    </div>
                    <div className="fliter">
                        <span onClick={this.handleFliter}>
                            <i className="fa fa-filter"></i>
                        </span>
                    </div>
                </div>
                {this.state.isValid && !this.state.isSearch && <p className="is-valid">Friend name only support Alphabets.</p>}
                <div className="section">
                    {this.state.list.length > 0 ?
                        this.state.list.map((item, index) => 
                            <div className="record-wrap" key={index}>
                                <div className="record">
                                    {item.name}
                                    <p>is your friend</p>
                                </div>
                                <div className={`favorite ${item.favorite ? 'stared' : ''}`}>
                                    <span onClick={() => this.handleFavorite(item)}>
                                        <i className={`fa fa-star${item.favorite ? ' stared' : '-o'}`}></i>
                                    </span>
                                </div>
                                <div className="delete">
                                    <span onClick={() => this.handleDelete(item)}>
                                        <i className="fa fa-trash-o"></i>
                                    </span>
                                </div>
                            </div>
                        ) : 
                        <p className="no-record">No Record Found...</p>
                    }
                    {!this.state.isSearch && this.state.list.length > 0 && <div className="Pagination">
                        <button 
                            type="button" 
                            className="first" 
                            onClick={() => this.handlePagi('first')}
                            disabled={this.state.first}>
                            <i className="fa fa-angle-double-left"></i>
                        </button>
                        <button 
                            type="button" 
                            className="prev" 
                            onClick={() => this.handlePagi('prev')}
                            disabled={this.state.prev}>
                            <i className="fa fa-angle-left"></i>
                        </button>
                        <span className="current">
                            {this.state.currentPage}
                        </span>
                        <button 
                            type="button" 
                            className="next" 
                            onClick={() => this.handlePagi('next')}
                            disabled={this.state.next}>
                            <i className="fa fa-angle-right"></i>
                        </button>
                        <button 
                            type="button" 
                            className="last" 
                            onClick={() => this.handlePagi('last')}
                            disabled={this.state.last}>
                            <i className="fa fa-angle-double-right"></i>
                        </button>
                    </div>}
                </div>
                {this.state.isModal ? 
                    <div className="modal">
                        <div className="modal-text">
                            {'Are you sure you want to delete ' + this.state.deleteFriend.name + ' friend.'}
                            <button className="btn1" onClick={() => this.setState({ isModal: false })}>No</button>
                            <button className="btn2" onClick={this.submitDelete}>Yes</button>
                        </div>
                    </div> : null
                }
            </div>
        );
    }
}

export default FriendList;