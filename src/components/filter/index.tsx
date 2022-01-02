import React, { FC, useState, Dispatch, SetStateAction, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { CategoryCollection } from '../../interfaces/stories';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_CATEGORY } from '../../graphQL/products';

import styles from './filters.module.scss';

interface FetchArgs {
  products: string | string[];
  collection: string | string[];
  page: number;
}

interface Props {
  filters: Record<string, { items: CategoryCollection[] }>;
  fetchArgs: FetchArgs;
  setFetchArgs: Dispatch<SetStateAction<FetchArgs>>;
}

const Filters: FC<Props> = ({ filters, fetchArgs, setFetchArgs }) => {
  const [selected, setSelected] = useState<Record<string, string[]>>({ category: [], collection: [] });

  const { refetch } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { category: selected.category.toString() },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setFetchArgs({
        ...fetchArgs,
        page: 1,
        products: data?.ProductItems.items.map((item: { uuid: string }) => item.uuid)
      });
    }
  });

  console.log(selected);
  // const [fetchProductsByCategory, { data: lazyData, called, networkStatus }] = useLazyQuery(GET_PRODUCTS_BY_CATEGORY, {
  //   ssr: false,
  //   notifyOnNetworkStatusChange: true
  // });

  // console.log('data', data, 'lazy', lazyData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'all') {
      console.log('isall', e.target.name);
      return setSelected({ ...selected, [e.target.name]: [] });
    }

    if (e.target.checked) {
      return setSelected({ ...selected, [e.target.name]: [...selected[e.target.name], e.target.value] });
    } else {
      return setSelected({
        ...selected,
        [e.target.name]: selected[e.target.name].filter((item) => item !== e.target.value)
      });
    }
  };

  useEffect(() => {
    if (selected.category.length) {
      refetch();
    } else {
      setFetchArgs({ ...fetchArgs, page: 1, products: [] });
    }

    setFetchArgs({ ...fetchArgs, page: 1, collection: selected.collection });
  }, [selected]);

  return (
    <>
      {Object.keys(filters).map((filter) => {
        const { items } = filters[filter];
        console.log(filter);

        return (
          <div key={filter} className={styles.filter}>
            <p className={styles.filter_title}>Filter by {filter}</p>
            <ul className={styles.filter_options}>
              <li className={styles.filter_allOption}>
                <label className={styles.filter_option} htmlFor={`all ${filter}`}>
                  All {filter}
                </label>
                <input
                  type="checkbox"
                  id={`all ${filter}`}
                  name={filter}
                  value="all"
                  className={styles.filter_optionCheckbox}
                  onChange={handleChange}
                />
              </li>
              {items.map((option) => (
                <li key={option.uuid}>
                  <label
                    className={classNames(styles.filter_option, {
                      [styles.filterOption_selected]: selected[filter].includes(option.uuid)
                    })}
                    htmlFor={option.uuid}
                  >
                    {option.name}
                  </label>
                  <input
                    type="checkbox"
                    id={option.uuid}
                    name={filter}
                    value={option.uuid}
                    className={styles.filter_optionCheckbox}
                    onChange={handleChange}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
};

export default Filters;
