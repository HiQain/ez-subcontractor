"use client";
import React from "react";
import styles from "../../styles/loader.module.css";
import classNames from "classnames";

const Loader = ({ fadeOut }) => {
    return (
        <div className={classNames(styles.loaderWrapper, { [styles.fadeOut]: fadeOut })}>
            <div className={styles.loader}></div>
        </div>
    );
};

export default Loader;
