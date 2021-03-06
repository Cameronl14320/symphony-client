import React from "react";
import './carousel.scss';
import CarouselButton from "./carousel-components/carousel-button";
import CarouselCard from "./carousel-components/carousel-card";
import IFeature from "../../data/interfaces/IFeature";
import CarouselStripe from "./carousel-components/carousel-stripe";

export const Carousel = (props: { features: IFeature[], displayExtra: number }) => {
    const [selected, setSelected] = React.useState<number>(0);
    const { features, displayExtra } = props;
    const longestLength: number = getLongestWidth(features);

    if (features.length < displayExtra || features.length < 3) {
        return EmptyCarousel();
    }

    const onSelect = (index: number) => {
        setSelected(index);
    }

    const addButtons = (initial: any[], start:number, finish: number, isIncrement: boolean = true, counter: number) => {
        let tempCount = counter;
        if (isIncrement) {
            for (let extra = start; extra < finish; extra++) {
                carouselButtons.push(
                    <CarouselButton key={"carousel-button-" + extra} feature={ features[extra] } active={ selected } index={ extra } onClick={() => onSelect(extra)}/>
                );
                tempCount++;
            }
        } else {
            for (let extra = start; extra < finish; extra--) {
                carouselButtons.push(
                    <CarouselButton key={"carousel-button-" + extra} feature={ features[extra] } active={ selected } index={ extra } onClick={() => onSelect(extra)}/>
                );
                tempCount++;
            }
        }
        return tempCount;
    }

    const carouselButtons: any[] = [];
        let counter = 0;
        const prefix = selected - displayExtra;
        if (prefix < 0) {
            counter = addButtons(carouselButtons, features.length + prefix, features.length, true, counter);
        }
        else if (selected === features.length) {
            counter = addButtons(carouselButtons, features.length - prefix + 1, features.length - 1, true, counter);
        }

        if (counter < displayExtra) {
            addButtons(carouselButtons, selected - displayExtra + counter, selected, true, counter);
        }
        carouselButtons.push(
            <CarouselButton key={"carousel-button-selected"} feature={ features[selected] } active={ selected } index={ selected } onClick={() => onSelect(selected)}/>
        );
        counter = 0;
        const suffix = selected + displayExtra + 1;
        for (let extra = selected + 1; extra < suffix; extra++) {
            if (extra < features.length) {
                carouselButtons.push(
                    <CarouselButton key={"carousel-button-" + extra} feature={ features[extra] } active={ selected } index={ extra } onClick={() => onSelect(extra)}/>
                );
                counter++;
            } else {
                break;
            }
        }
        if (counter < displayExtra) {
            const suffix = displayExtra - counter;
            addButtons(carouselButtons, 0, suffix, true, counter)
        }
    return (
        <div className="carousel-container">
            <div className="carousel-display-large">
                <ul className="carousel-buttons" style={{width: longestLength}}>
                    { carouselButtons }
                </ul>
                <div className="carousel-content">
                    <CarouselCard item={ features[selected]}/>
                </div>
            </div>
            <div className="carousel-display-small">
                <CarouselStripe/>
            </div>
        </div>
    )
}

const EmptyCarousel = () => {
    return (
        <div/>
    )
}

function getLongestWidth(features: IFeature[]) {
    let longestLength = 0;
    for (let feature of features) {
        longestLength = Math.max(longestLength, getTextWidth(feature.title));
    }
    return longestLength;
}

function getTextWidth(text: string) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!!context) {
        context.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

        return context.measureText(text).width;
    }
    return 0;
}

export default Carousel;
