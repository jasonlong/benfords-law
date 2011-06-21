# Testing Benford's Law

This is a simple experiment by [Jason Long](http://twitter.com/jasonlong) and [Bryce Thornton](http://twitter.com/brycethornton) to test how many real-life, publicly available datasets satisfy [Benford's Law](http://en.wikipedia.org/wiki/Benfords_law).

## Contributing Datasets

If you find this to be an interesting idea, we'd encourage you to help add more datasets to the site. We've intentionally kept the site as simple and lightweight as possible. There is no real backend - the data has been crunched in advance and the results are simply entered into JSON files.

To contribute a new dataset, you'll need to do two things:

1. Add the dataset name to `js/datasets/index.json`. The format is simply a key/value pair:

	{
		"twitter": "Twitter users by followers count",
		"stars": "Distance of stars from Earth in light years",
		"kiva": "Loan amounts on kiva.org",
		"library": "Total number of print materials in US libraries",
		"spain": "Population of Spanish cities"
	}

2. Create a new .json file in `/js/datasets/` that matches the key used in step 1. The format looks like this:

	{
		"values": {
			"1": 32.62,
			"2": 16.66,
			"3": 11.80,
			"4": 9.26,
			"5": 7.63,
			"6": 6.55,
			"7": 5.76,
			"8": 5.14,
			"9": 4.56
		},
		"num_records": "38,670,514",
		"min_value": "1",
		"max_value": "4,706,631",
		"source": "http://www.infochimps.com/datasets/twitter-census-twitter-users-by-friends-count"
	}

It's important to include the source of the data used so that others can verify and reproduce the results.