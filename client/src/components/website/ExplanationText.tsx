import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import React, { useEffect, useState } from "react";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";

import "./rsh-style.css";
import GitHubRedIcon from "../../assets/github_red.svg";
import GitHubIcon from "../../assets/github.svg";

SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("javascript", js);

const startingHash = location.hash;

export function ExplanationText() {
  const [showReactUsage, setShowReactUsage] = useState(location.search === "?basicFlow=false");
  useEffect(() => {
    if (startingHash && document.querySelector(startingHash)) {
      document.querySelector(startingHash)?.scrollIntoView(true);
    }
  }, []);

  return (
    <div className={"mt-6 mb-24 p-4 md:p-0 w-full md:w-[800px]"}>
      <h1 id={"docsTop"} style={h1Style}>
        <a href="#docsTop">Bullet Mania with Matchmaking</a>
      </h1>
      <Link href={"https://github.com/idem-matchmaking/bullet-mania"} icon={GitHubIcon}>
        Source code
      </Link>
      <p style={textStyle}>
        Hathora built Bullet Mania to showcase how simple it can be to build scalable multiplayer games with Hathora Cloud.
      </p>
      <p style={textStyle}>
        Adding Idem’s matchmaking to Bullet Mania shows how a full-fledged multiplayer game can be created, without the need of any server infrastructure, other than a simple webserver.
      </p>
      <p style={textStyle}>
      In this solution, the players directly connect to Idem’s matchmaker. When a match is found, Idem spins up a game server on Hathora’s cloud, where the game is played. After the game is concluded, the results are returned to Idem in order to update the rating and ranking.
      </p>
     <div className={"flex justify-center mt-6"}>
        <img src={"/player_based.png"} className={"w-[680px]"} />
      </div>
      <p style={textStyle}>
        Keep reading in Idem's {" "}
<Link href={"https://docs.idem.gg/b_getting_started/hosting_integration"}>documentation</Link> for in-depth explanation of this implementation and to learn how to add scalability and matchmaking to your own multiplayer game.
      </p>
    </div>
  );
}

function CodePathToggle(props: { showReactUsage: boolean; setShowReactUsage: (val: boolean) => void }) {
  return (
    <div className={"flex gap-1 ml-4 mt-6"}>
      <button
        className={`px-4 py-1 rounded-t border ${
          !props.showReactUsage
            ? "text-bold text-neutralgray-300 underline bg-neutralgray-650 border-hathoraSecondary-500 border-b-transparent z-20"
            : "bg-neutralgray-550 text-neutralgray-400 hover:underline hover:bg-neutralgray-900 hover:text-neutralgray-200 border-transparent hover:border-hathoraSecondary-500 z-0"
        }`}
        onClick={() => {
          props.setShowReactUsage(false);
          window.history.replaceState(null, "", "?basicFlow=true" + location.hash);
        }}
      >
        Basic SDK Usage
      </button>
      <button
        className={`flex items-center gap-2 px-6 py-2 rounded-t border ${
          props.showReactUsage
            ? "text-bold text-neutralgray-300 bg-neutralgray-650 border-secondary-500 border-b-transparent z-20"
            : "bg-neutralgray-550 text-neutralgray-400 hover:underline hover:bg-neutralgray-900 hover:text-neutralgray-200 border-transparent hover:border-secondary-500 z-0"
        }`}
        onClick={() => {
          props.setShowReactUsage(true);
          window.history.replaceState(null, "", "?basicFlow=false" + location.hash);
        }}
      >
        React Usage{" "}
        <div>
          <img src="bullet_mania_logo_light.png" className="h-[32px] md:h-[24px]" alt="logo" />
        </div>
      </button>
    </div>
  );
}

function CodePathToggleContent(props: {
  children: React.ReactNode;
  className?: string;
  showReactUsage: boolean;
  setShowReactUsage: (val: boolean) => void;
}) {
  return (
    <>
      <CodePathToggle showReactUsage={props.showReactUsage} setShowReactUsage={props.setShowReactUsage} />
      <div
        className={`py-3 px-3 border bg-neutralgray-650 relative -mt-px z-10 rounded ${
          props.showReactUsage ? " border-secondary-500" : "border-hathoraSecondary-500"
        } ${props.className}`}
      >
        {props.children}
      </div>
    </>
  );
}

function BulletManiaCodeLink(props: {
  links: {
    linkText: string;
    linkHref: string;
  }[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-2 py-2 mt-3 w-fit flex gap-2 items-center md:text-base text-secondary-300 ${props.className}`}>
      <div>
        <img src="bullet_mania_logo_light.png" className="h-[32px] md:h-[24px]" alt="logo" />
      </div>
      {props.children} {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      {props.links.length === 1 ? (
        <Link
          href={props.links[0].linkHref}
          color="text-brand-300"
          hoverColor="hover:bg-neutralgray-700"
          icon={GitHubRedIcon}
        >
          {props.links[0].linkText}
        </Link>
      ) : (
        <ul className={"list-disc ml-6 text-brand-300"}>
          {props.links.map((link) => (
            <li key={link.linkHref}>
              <Link
                href={link.linkHref}
                color="text-brand-300"
                hoverColor="hover:bg-neutralgray-700"
                icon={GitHubRedIcon}
              >
                {link.linkText}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*
 * Component used for short code snippet
 */
function Code(props: { children: React.ReactNode; className?: string }) {
  return (
    <code className={`bg-neutralgray-550 text-hathoraBrand-400 text-sm p-0.5 mt-2 rounded ${props.className}`}>
      {props.children}
    </code>
  );
}

/*
 * Component used for code block
 */
function CodeBlock(props: { children: string | string[]; className?: string; singleLine?: boolean }) {
  return (
    <div className={`container text-sm ${props.singleLine ? "mt-3 w-fit" : "md:min-w-[600px]"}`}>
      <SyntaxHighlighter
        language="javascript"
        className={`syntax-highlighter ${props.singleLine ? "bg-neutralgray-650" : "bg-neutralgray-700"}`}
        useInlineStyles={false}
      >
        {props.children}
      </SyntaxHighlighter>
    </div>
  );
}

/*
 * Component used for external links
 */
function Link(props: {
  children: React.ReactNode;
  href: string;
  color?: string;
  hoverColor?: string;
  className?: string;
  icon?: string;
}) {
  return (
    <a
      className={`font-hathoraBody ${props.color ? props.color : "text-hathoraBrand-500"} hover:underline ${
        props.icon
          ? `inline-flex items-center rounded -ml-2 px-2 py-1 ${
              props.hoverColor ? props.hoverColor : "hover:bg-neutralgray-650"
            }`
          : "inline-block"
      } ${props.className}`}
      href={props.href}
      target={"_blank"}
    >
      {props.children}
      {props.icon && <img src={props.icon} className={"h4 w-4 ml-1"} />}
    </a>
  );
}

/*
 * Component used to link text to scroll to a specific section
 */
export function NavLink(props: { children: React.ReactNode; headingId: string; className?: string }) {
  return (
    <a
      href={`#${props.headingId}`}
      className={`font-hathoraBody text-hathoraBrand-500 hover:underline  ${props.className}`}
    >
      {props.children}
    </a>
  );
}

/*
 * Component used to render buttons over screenshot and scroll to specific sections
 */
function NavButton(props: { children: React.ReactNode; headingId: string; className?: string }) {
  return (
    <a
      href={`#${props.headingId}`}
      className={`absolute w-[160px] py-2 rounded bg-neutralgray-700 transition duration-400 group hover:bg-hathoraBrand-500 hover:text-neutralgray-700 font-semibold flex items-center justify-center font-hathora text-xs text-hathoraBrand-500 ${props.className}`}
    >
      {props.children}
    </a>
  );
}

const h1Style = {
  fontFamily: "Oxanium",
  fontStyle: "regular",
  fontWeight: 500,
  fontSize: "32px",
  lineHeight: "40px",
  color: "#30e8e6",
  marginBottom: "12px",
  marginTop: "28px",
};

const h2Style = {
  fontFamily: "Space Grotesk",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "22px",
  lineHeight: "28px",
  color: "#AF64EE",
  marginBottom: "10px",
  marginTop: "20px",
};

const textStyle = {
  marginTop: "16px",
  fontFamily: "Lato",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#d4d4e3",
};
