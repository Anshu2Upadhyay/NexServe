const calculateEstimatedPrice = ({
    category,
    difficulty,
    urgency
}) => {

    let minPrice = 200;
    let maxPrice = 400;


    // Category base pricing
    const categoryPricing = {

        Plumbing: {
            min: 250,
            max: 500
        },

        Electrical: {
            min: 250,
            max: 550
        },

        Carpentry: {
            min: 300,
            max: 700
        },

        Painting: {
            min: 500,
            max: 1200
        },

        "Appliance Repair": {
            min: 300,
            max: 800
        },

        Masonry: {
            min: 400,
            max: 1000
        }
    };


    const pricing =
        categoryPricing[category];

    if (pricing) {
        minPrice = pricing.min;
        maxPrice = pricing.max;
    }


    // Difficulty adjustment
    if (difficulty === "Easy") {

        minPrice =
            Math.round(minPrice * 0.8);

        maxPrice =
            Math.round(maxPrice * 0.8);

    } else if (difficulty === "Hard") {

        minPrice =
            Math.round(minPrice * 1.5);

        maxPrice =
            Math.round(maxPrice * 1.5);
    }


    // Urgent job adjustment
    if (urgency === "urgent") {

        minPrice =
            Math.round(minPrice * 1.25);

        maxPrice =
            Math.round(maxPrice * 1.25);
    }


    return {
        minPrice,
        maxPrice
    };
};


module.exports = {
    calculateEstimatedPrice
};