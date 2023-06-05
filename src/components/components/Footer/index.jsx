import classes from "./footer.module.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
      <footer className={classes.footer} data-cy="footer">
        <ul>
          <li className={classes.footerLinks}>
            <a
                href="https://www.linkedin.com/company/tobb-etu-computer-science-community/"
                target="_blank"
                rel="noopener noreferrer"
                data-cy="linkedinLink"
            >
              LinkedIn
            </a>{" "}
            &bull;{" "}
            <a
                href="https://github.com/TOBB-ETU-CS-Community/etuScore"
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
