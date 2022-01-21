import React, { FC } from 'react';
import classNames from 'classnames';
import { CategoryCollection } from '../../interfaces/stories';

import styles from './Filters.module.scss';

interface Props {
  type: string;
  options: CategoryCollection[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected: Record<string, string[]>;
}

const Filters: FC<Props> = ({ type, options, onChange, selected }) => {
  return (
    <div key={type} className={styles.filter}>
      <p className={styles.filter_title}>Filter by {type}</p>
      <ul className={styles.filter_options}>
        <li className={styles.filter_allOption}>
          <label className={styles.filter_option} htmlFor={`all ${type}`}>
            All {type}
          </label>
          <input
            type="checkbox"
            id={`all ${type}`}
            name={type}
            value="all"
            className={styles.filter_optionCheckbox}
            onChange={onChange}
          />
        </li>
        {options.map((option) => (
          <li key={option.uuid}>
            <label
              className={classNames(styles.filter_option, {
                [styles.filterOption_selected]: selected[type].includes(option.uuid)
              })}
              htmlFor={option.uuid}
            >
              {option.name}
            </label>
            <input
              type="checkbox"
              id={option.uuid}
              name={type}
              value={option.uuid}
              className={styles.filter_optionCheckbox}
              onChange={onChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Filters;
