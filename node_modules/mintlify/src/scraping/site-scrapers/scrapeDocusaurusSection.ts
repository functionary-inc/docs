import cheerio from "cheerio";
import { NavigationEntry } from "../..//navigation.js";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import combineNavWithEmptyGroupTitles from "../combineNavWithEmptyGroupTitles.js";
import { scrapeDocusaurusPage } from "./scrapeDocusaurusPage.js";
import getLinksRecursively from "./getLinksRecursively.js";
import alternateGroupTitle from "./alternateGroupTitle.js";

export async function scrapeDocusaurusSection(
  html: string,
  origin: string,
  cliDir: string,
  overwrite: boolean
) {
  const $ = cheerio.load(html);

  // Get all the navigation sections
  const navigationSections = $(".theme-doc-sidebar-menu").first().children();

  // Get all links per group
  const groupsConfig = navigationSections
    .map((i, s) => {
      const section = $(s);

      // Links without a group
      if (section.hasClass("theme-doc-sidebar-item-link")) {
        const linkHref = section.find("a[href]").first().attr("href");
        return {
          group: "",
          pages: [linkHref],
        };
      }

      const firstLink = section
        .find(".menu__list-item-collapsible")
        .first()
        .find("a[href]");

      const sectionTitle = firstLink.text();
      const firstHref = firstLink.attr("href");
      const linkSections = section.children().eq(1).children();

      const pages = getLinksRecursively(linkSections, $);

      return {
        group: sectionTitle || alternateGroupTitle(firstLink, pages),
        pages: firstHref ? [firstHref, ...pages] : pages,
      };
    })
    .toArray();

  // Merge groups with empty titles together
  const reducedGroupsConfig = combineNavWithEmptyGroupTitles(groupsConfig);

  // Scrape each link in the navigation.
  const groupsConfigCleanPaths = await Promise.all(
    reducedGroupsConfig.map(async (groupConfig) => {
      groupConfig.pages = (
        await Promise.all(
          groupConfig.pages.map(async (navEntry: NavigationEntry) =>
            // Docusaurus requires a directory on all sections wheras we use root.
            // /docs is their default directory so we remove it
            scrapeGettingFileNameFromUrl(
              navEntry,
              cliDir,
              origin,
              overwrite,
              scrapeDocusaurusPage,
              false,
              "/docs"
            )
          )
        )
      )
        // Remove skipped index pages (they return undefined from the above function)
        .filter(Boolean);
      return groupConfig;
    })
  );

  return groupsConfigCleanPaths;
}
