import classes from "./footer.module.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
      <footer className={classes.footer} data-cy="footer">
        <ul>
          <li className={classes.footerLinks}>
            <a
                href="https://tr.linkedin.com/company/tobb-etu-computer-science-community?original_referer=https%3A%2F%2Fwww.google.com%2F"
                target="_blank"
                rel="noopener noreferrer"
                data-cy="linkedinLink"
            >
              LinkedIn
            </a>{" "}
            &bull;{" "}
            <a
                href="https://github.com/berykay/etuScore"
                target="_blank"
                rel="noopener noreferrer"
                data-cy="githubLink"
            >
              Github
            </a>
          </li>
          <li className={classes.footerCopyrights}>
            All rights reserved &copy; {currentYear} TOBB ETU Bilgisayar Topluluğu
          </li>
          <li>
            <div className={classes.version}>v.1.0  </div>
          </li>
        </ul>
      </footer>
  );
};
export default Footer;
