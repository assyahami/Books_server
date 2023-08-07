import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import FilterOptions from '../components/FilterOptions'
import { ProductCard } from '../components/Cards'
import Search from '../components/Search'
import { GETAPI } from '../utils/apiCalls'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../components/Pagination'

const Home = () => {

    const { books, pagination } = useSelector((state) => state.bookReducer)
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const homeRef = useRef()
    const [sortOrder, setSortOrder] = useState('ascending');
    
    const handleSortToggle = () => {
        const newSortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
        setSortOrder(newSortOrder);

        const sorted = books.slice().sort((a, b) => {
            if (newSortOrder === 'ascending') {
                return a.year - b.year;
            } else {
                return b.year - a.year;
            }
        });

        dispatch({
            type: "GETBOOK",
            payload: {
                data: sorted,
                pagination: pagination,
            }
        })
    };

    const getBooksList = async (currentPage) => {
        try {
            const getBooks = await GETAPI(`/books?page=${currentPage || page}`)
            dispatch({
                type: "GETBOOK",
                payload: {
                    data: getBooks.data,
                    pagination: getBooks.pagination,
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handlePageChange = async (page) => {
        getBooksList(page)
        setPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" })
    };

    const refresData = async (page) => {
        getBooksList(0)
    };


    useEffect(() => {
        getBooksList()
    }, [])


    return (
        <div className='home-container' ref={homeRef}>
            <Header isHome={true} />
            <FilterOptions getBooksList={getBooksList} />
            <div className='products-container'>

                <div className='card-container'>

                    {books.length > 5 && <div className='flex_row explore'>
                        <div className='title_header'>
                            <h2 className='title_head'>Explore</h2>
                            <span className='border-line'></span>
                        </div>
                        <div className='sort-btn'>
                            <button onClick={handleSortToggle} className='submit_btn'>{sortOrder === 'ascending' ? "A-Z Sort" : "Z-A Sort"}</button>
                        </div>
                    </div>
                    }
                    <div className='list-cards list-card-container'>
                        {books.length <= 0 ?
                            <h2>No data found !</h2>
                            :
                            books?.map((item) => {
                                return (
                                    <div key={item.id}>
                                        <ProductCard {...item} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div>
                {books.length <= 5 ?
                    <>
                        <div className='center_div back_btn'>
                            <button className='submit_btn' onClick={() => refresData()}>Back to exlpore</button>
                        </div>
                    </>
                    : <Pagination
                        currentPage={page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />}
            </div>
        </div>
    )
}

export default Home