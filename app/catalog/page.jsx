"use client"
import { useState } from "react";
import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import QueryHandler from "../assets/components/query-handler";
import Filters from "../assets/components/filters";
// import Search from "../assets/components/search";
import Listings from "../assets/components/listings";
import "../assets/styles/pages/catalog.scss";
import IconButton from "../assets/components/icon-button";

export default function Catalog({searchParams}) {
    return (
        <main>
            <Banner src="catalog.jpg">
                <Display size="medium">Catalog</Display>
            </Banner>
            <QueryHandler>
                <section className="catalog">
                    <Filters />
                    <div className="listings">
                        {/* <Search /> */}
                        <Listings searchParams={searchParams} />
                    </div>
                </section>
            </QueryHandler>
        </main>
    )
}